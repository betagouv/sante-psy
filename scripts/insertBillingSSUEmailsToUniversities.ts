import fs from 'fs';
import dbUniversities from '../db/universities';

type CSVRow = {
  id: string;
  billingEmail: string;
  emailSSU: string;
};

const cleanEmail = (email?: string): string => (email ?? '')
  .replace(/^"|"$/g, '')
  .replace(/\s+/g, '')
  .trim();

const cleanAndJoinEmails = (raw?: string): string => {
  if (!raw) return '';
  return raw
    .replace(/^"|"$/g, '')
    .split(';')
    .map(cleanEmail)
    .filter((e) => e.length > 0)
    .join(', ');
};

const insertEmailToUniversities = async (csvRows: CSVRow[]): Promise<void> => {
  const universities = await dbUniversities.getAll();

  const updatedUniversities = universities.map((dbUni) => {
    const match = csvRows.find((row) => row.id === dbUni.id);

    if (!match) {
      console.warn(`⚠️ No match found for university id: ${dbUni.id}`);
      return dbUni;
    }

    return {
      ...dbUni,
      billingEmail: cleanAndJoinEmails(match.billingEmail),
      emailSSU: cleanAndJoinEmails(match.emailSSU),
    };
  });

  await dbUniversities.upsertMany(updatedUniversities);
  console.log('✅ Emails successfully inserted into universities');
  process.exit(0);
};

const parseCSV = (): void => {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('❌ Please provide a CSV file path');
    process.exit(1);
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading file:', err);
      process.exit(1);
    }

    const separator = ',';
    const [headerLine, ...lines] = data.split('\n');
    const headers = headerLine.split(separator).map((h) => h.trim());

    const idIndex = headers.findIndex((h) => h.toLowerCase() === 'id');
    const billingEmailIndex = headers.findIndex((h) => h.toLowerCase().includes('billing'));
    const emailSSUIndex = headers.findIndex((h) => h.toLowerCase().includes('ssu'));

    if (idIndex === -1 || billingEmailIndex === -1 || emailSSUIndex === -1) {
      console.error('❌ Required headers missing: id, billingEmail, emailSSU');
      process.exit(1);
    }

    const csvData: CSVRow[] = lines
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(separator).map((v) => v.trim());

        return {
          id: values[idIndex].replace(/^"|"$/g, '').trim(),
          billingEmail: values[billingEmailIndex],
          emailSSU: values[emailSSUIndex],
        };
      });

    insertEmailToUniversities(csvData);
  });
};

parseCSV();
