export const validateIneFormat = (value) => {
  const patterns = [
    /^[0-9]{9}[A-HJK]{2}$/, // INE-RNIE
    /^\d{10}[A-HJ-NPR-Z]$/, // INE-BEA
    /^[0-9A-Z]{10}\d$/, // INE-Base 36
    /^\d{4}[A]\d{5}[A-HJ-NPR-Z]$/, // INE-SIFA
    /^\d{4}[D]\d{5}[A-HJ-NPR-Z]$/i // INE provisoire
  ];

  return patterns.some(pattern => pattern.test(value));
};
