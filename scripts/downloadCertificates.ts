/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import s3 from '../services/s3';
import path from 'path';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { buffer as streamToBuffer } from 'stream/consumers';
import { testArgUnivYear } from './utils';

const OUTPUT_DIR = process.env.DOWNLOAD_DIR || './downloaded-certificates';

const getStudentPrefix = (studentId: string): string =>
  `certificates/students/${studentId}/`;

// Extracts studentId and univYear from a key like:
// certificates/students/{studentId}/{univYear}/certificate.pdf
const parseKey = (
  key: string,
): { studentId: string; univYear: string } | null => {
  const match = key.match(
    /^certificates\/students\/([^/]+)\/([^/]+)\/certificate\.pdf$/,
  );
  if (!match) return null;
  return { studentId: match[1], univYear: match[2] };
};

const downloadKeyFlat = async (key: string): Promise<boolean> => {
  const parsed = parseKey(key);
  if (!parsed) {
    console.warn(`Key "${key}" doesn't match expected pattern, skipping.`);
    return false;
  }

  const { studentId, univYear } = parsed;
  const fileName = `${studentId}-${univYear}.pdf`;
  const destPath = path.join(OUTPUT_DIR, fileName);

  try {
    const response = await s3.s3.send(
      new GetObjectCommand({ Bucket: s3.S3_BUCKET, Key: key }),
    );

    if (!response.Body) {
      console.warn(`No body returned for key "${key}", skipping.`);
      return false;
    }

    // @ts-expect-error - Node runtime Body is a Readable stream
    const fileBuffer = await streamToBuffer(response.Body);
    fs.writeFileSync(destPath, fileBuffer);
    return true;
  } catch (err) {
    s3.logS3Error(`downloadKeyFlat (${key})`, err);
    return false;
  }
};

type Tally = { downloaded: number; missing: number };

const downloadKeysSequentially = async (keys: string[]): Promise<number> =>
  keys.reduce<Promise<number>>(async (accPromise, key) => {
    const acc = await accPromise;
    const success = await downloadKeyFlat(key);
    return success ? acc + 1 : acc;
  }, Promise.resolve(0));

const downloadCertificatesForStudents = async (
  univYear: string,
  studentIds: string[],
): Promise<void> => {
  console.log(
    `++ Script - Downloading certificates for univ year: ${univYear} in ${OUTPUT_DIR}`,
  );
  console.log('++ Script - Student ids: ', studentIds);
  testArgUnivYear(univYear);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const finalTally = await studentIds.reduce<Promise<Tally>>(
    async (accPromise, studentId) => {
      const acc = await accPromise;
      const prefix = `${getStudentPrefix(studentId)}/${univYear}`;

      try {
        const keys = await s3.listAllKeys(prefix);

        if (keys.length === 0) {
          console.warn(
            `No objects found for student "${studentId}" (prefix: ${prefix})`,
          );
          return { ...acc, missing: acc.missing + 1 };
        }

        const downloadedCount = await downloadKeysSequentially(keys);
        return { ...acc, downloaded: acc.downloaded + downloadedCount };
      } catch (err) {
        s3.logS3Error(`listAllKeys (student ${studentId})`, err);
        return acc;
      }
    },
    Promise.resolve({ downloaded: 0, missing: 0 }),
  );

  console.log(
    `\nDone. Downloaded ${finalTally.downloaded} file(s). ${finalTally.missing} student(s) had no objects.`,
  );
};

// --- Entry point -------------------------------------------------------

if (process.argv.length <= 2) {
  console.log('Invalid: missing arguments');
  console.log(
    'Usage: ts-node downloadCertificates.ts <univYear> <studentId1,studentId2,...>',
  );
  console.log(
    'Example: ts-node downloadCertificates.ts 2026-2027 abc-123,def-456',
  );
  process.exit(1);
}

const univYearArg = process.argv[2];
const studentIdsArg = process.argv[3];

const studentIds: string[] = studentIdsArg.split(',');

downloadCertificatesForStudents(univYearArg, studentIds).catch((err) => {
  console.error('Fatal error while downloading certificates:', err);
  process.exit(1);
});
