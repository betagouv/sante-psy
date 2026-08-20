const SEPTEMBER = 8;
const DECEMBER = 11;
export const startUnivYear = (date: Date): string => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear - 1}-09-01T00:00:00.000Z`;
  }
  return `${currentYear}-09-01T00:00:00.000Z`;
};

export const endUnivYear = (date: Date): string => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear}-09-01T00:00:00.000Z`;
  }
  return `${currentYear + 1}-09-01T00:00:00.000Z`;
};

export const startCurrentUnivYear = (): string => startUnivYear(new Date());

export const endCurrentUnivYear = (): string => endUnivYear(new Date());

export const getUnivYear = (date: Date): string => {
  const cycle =
    date.getMonth() >= SEPTEMBER && date.getMonth() <= DECEMBER
      ? `${date.getFullYear()}-${date.getFullYear() + 1}`
      : `${date.getFullYear() - 1}-${date.getFullYear()}`;
  return cycle;
};

export const getStartUnivYearStr = (univYear: string): Date => {
  const start = parseInt(univYear.slice(0, 4));
  return new Date(start, SEPTEMBER, 1);
};

export const getEndUnivYearStr = (univYear: string): Date => {
  const end = parseInt(univYear.slice(5, 9));
  return new Date(end, SEPTEMBER, 1);
};
