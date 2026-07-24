// scripts/init-local-bucket.ts
import {
  HeadBucketCommand,
  CreateBucketCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { s3, S3_BUCKET } from '../services/s3';

const run = async (): Promise<void> => {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
    console.log(`✔ Bucket "${S3_BUCKET}" already exists.`);
  } catch (err) {
    if (
      err instanceof S3ServiceException &&
      err.$metadata?.httpStatusCode === 404
    ) {
      await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
      console.log(`✔ Bucket "${S3_BUCKET}" created.`);
    } else {
      console.error('Error checking/creating bucket:', err);
      process.exit(1);
    }
  }
};

run();
