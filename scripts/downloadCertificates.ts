/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import s3 from '../services/s3';

const OUTPUT_DIR = process.env.DOWNLOAD_DIR || './downloaded-certificates';

const getStudentPrefix = (studentId: string): string =>
  `certificates/students/${studentId}/`;

type Tally = { downloaded: number; missing: number };

// Downloads every key for a single student, sequentially, via reduce
// (avoids a for...of loop while still awaiting one download at a time).
const downloadKeysSequentially = async (keys: string[]): Promise<number> =>
  keys.reduce<Promise<number>>(async (accPromise, key) => {
    const acc = await accPromise;
    try {
      await s3.downloadObject(key, OUTPUT_DIR);
      return acc + 1;
    } catch (err) {
      s3.logS3Error(`downloadObject (${key})`, err);
      return acc;
    }
  }, Promise.resolve(0));

const downloadCertificatesForStudents = async (
  studentIds: string[],
): Promise<void> => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const finalTally = await studentIds.reduce<Promise<Tally>>(
    async (accPromise, studentId) => {
      const acc = await accPromise;
      const prefix = getStudentPrefix(studentId);

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

// Replace with your actual list of ids, or load from a file/arg.
const studentIds: string[] = [];
downloadCertificatesForStudents(studentIds).catch((err) => {
  console.error('Fatal error while downloading certificates:', err);
  process.exit(1);
});
