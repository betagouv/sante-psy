import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
  ListObjectsV2Command,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import CustomError from '../utils/CustomError';
import { getUnivYear } from '../utils/univYears';
import path from 'path';
import fs from 'fs';
import { buffer as streamToBuffer } from 'stream/consumers';
import { Readable } from 'stream';

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

const getStudentCertificateKey = (token: string, univYear: string): string =>
  `certificates/students/${token}/${univYear}/certificate.pdf`;

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
  const univYear = getUnivYear(new Date());
  const finalKey = getStudentCertificateKey(studentId, univYear);

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

const listAllKeys = async (prefix: string): Promise<string[]> => {
  const response = await s3.send(
    new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: prefix,
    }),
  );

  return (response.Contents || [])
    .map((obj) => obj.Key)
    .filter((key): key is string => Boolean(key));
};

const downloadObject = async (
  key: string,
  outputDir: string,
): Promise<void> => {
  const response = await s3.send(
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
  );

  const body = response.Body;
  if (!body) {
    console.warn(`[S3] No body returned for key "${key}", skipping.`);
    return;
  }

  const destPath = path.join(outputDir, key);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  // @ts-expect-error - Node runtime Body is a Readable stream
  const fileBuffer = await streamToBuffer(body);
  fs.writeFileSync(destPath, fileBuffer);
};

const certificateExists = async (
  studentId: string,
  univYear: string,
): Promise<boolean> => {
  const key = getStudentCertificateKey(studentId, univYear);

  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      }),
    );
    return true;
  } catch (err) {
    if (
      err instanceof S3ServiceException &&
      (err.$metadata?.httpStatusCode === 404 || err.name === 'NotFound')
    ) {
      return false;
    }
    logS3Error(`certificateExists`, err);
    throw new CustomError('Erreur lors de la vérification du certificat.', 500);
  }
};

const getCertificateStream = async (
  studentId: string,
  univYear: string,
): Promise<{
  stream: Readable;
  contentType?: string;
  contentLength?: number;
} | null> => {
  const key = getStudentCertificateKey(studentId, univYear);

  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      }),
    );

    if (!response.Body) return null;

    return {
      stream: response.Body as Readable,
      contentType: response.ContentType,
      contentLength: response.ContentLength,
    };
  } catch (err) {
    if (
      err instanceof S3ServiceException &&
      (err.$metadata?.httpStatusCode === 404 || err.name === 'NoSuchKey')
    ) {
      return null;
    }
    logS3Error(`getCertificateStream `, err);
    throw new CustomError('Erreur lors de la récupération du certificat.', 500);
  }
};

const uploadStudentCertificate = async (
  studentId: string,
  univYear: string,
  file: Express.Multer.File,
): Promise<void> => {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: getStudentCertificateKey(studentId, univYear),
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
  } catch (err) {
    logS3Error(`uploadStudentCertificate (student ${studentId})`, err);
    throw new CustomError('Erreur lors du stockage du certificat.', 500);
  }
};

export default {
  s3,
  S3_BUCKET,
  uploadPendingCertificate,
  finalizePendingCertificate,
  logS3Error,
  listAllKeys,
  downloadObject,
  certificateExists,
  getCertificateStream,
  uploadStudentCertificate,
};
