import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import CustomError from '../utils/CustomError';

const isLocal =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'fr-par',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
  forcePathStyle: isLocal,
});

const S3_BUCKET = process.env.S3_BUCKET as string;

const getPendingCertificateKey = (token: string): string =>
  `certificates/pending-certificates/${token}.pdf`;

const getStudentCertificateKey = (token: string): string =>
  `certificates/students/${token}/certificate.pdf`;

const logS3Error = (context: string, err: unknown): void => {
  if (err instanceof S3ServiceException) {
    console.error(
      `[S3] ${context} failed (${err.$metadata?.httpStatusCode})`,
      err.message,
    );
  } else {
    console.error(`[S3] ${context} — unexpected error`, err);
  }
};

const uploadPendingCertificate = async (
  token: string,
  file: Express.Multer.File,
): Promise<void> => {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: getPendingCertificateKey(token),
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
  } catch (err) {
    logS3Error('uploadPendingCertificate', err);
    throw new CustomError('Erreur lors du stockage du certificat.', 500);
  }
};

const finalizePendingCertificate = async (
  token: string,
  studentId: string,
): Promise<void> => {
  const pendingKey = getPendingCertificateKey(token);
  const finalKey = getStudentCertificateKey(studentId);

  try {
    await s3.send(
      new CopyObjectCommand({
        Bucket: S3_BUCKET,
        CopySource: `${S3_BUCKET}/${pendingKey}`,
        Key: finalKey,
      }),
    );
    await s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: pendingKey,
      }),
    );
  } catch (err) {
    // don't throw — a missing certificate shouldn't block account creation,
    // this is logged for manual follow-up instead
    logS3Error(`finalizePendingCertificate (student ${studentId})`, err);
  }
};

export default {
  s3,
  S3_BUCKET,
  uploadPendingCertificate,
  finalizePendingCertificate,
};
