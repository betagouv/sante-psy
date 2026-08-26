import { UNIV_YEAR_REGEX } from '../utils/univYears';

export const testArgUnivYear = (univYear: string): void => {
  if (!UNIV_YEAR_REGEX.test(univYear)) {
    console.log('Invalid univ year format!');
    console.log('Help: format should be YYYY-YYYY, e.g. 2026-2027');
    process.exit(1);
  }
};
