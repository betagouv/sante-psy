import { S3Client } from '@aws-sdk/client-s3';

const isLocal =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'fr-par',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
  // Required for MinIO (and most non-AWS S3-compatible services):
  // forces path-style URLs (http://host/bucket/key) instead of
  // virtual-hosted-style (http://bucket.host/key), which MinIO doesn't support by default.
  forcePathStyle: isLocal,
});

export const S3_BUCKET = process.env.S3_BUCKET as string;
