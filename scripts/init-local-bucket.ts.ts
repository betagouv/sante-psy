import s3Service from '../services/s3';

s3Service.ensureBucketExists().catch(() => process.exit(1));
