export const startCurrentUnivYear = (): string => {
  const SEPTEMBER = 8;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear - 1}-09-01T00:00:00.000Z`;
  }
  return `${currentYear}-09-01T00:00:00.000Z`;
};

export const endCurrentUnivYear = (): string => {
  const SEPTEMBER = 8;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear}-09-01T00:00:00.000Z`;
  }
  return `${currentYear + 1}-09-01T00:00:00.000Z`;
};

export const getUnivYear = (date: Date) : string => {
  const SEPTEMBER = 8;
  const DECEMBER = 11;
  const cycle = (date.getMonth() >= SEPTEMBER && date.getMonth() <= DECEMBER)
    ? `${date.getFullYear()}-${date.getFullYear() + 1}`
    : `${date.getFullYear() - 1}-${date.getFullYear()}`;
  return cycle;
};
