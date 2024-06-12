export const startCurrentUnivYear = (): string => {
  const SEPTEMBER = 8;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear - 1}-09-01`;
  }
  return `${currentYear}-09-01`;
};

export const endCurrentUnivYear = (): string => {
  const SEPTEMBER = 8;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear}-09-01`;
  }
  return `${currentYear + 1}-09-01`;
};
