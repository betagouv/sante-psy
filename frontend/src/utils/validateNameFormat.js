const validateNameFormat = value => {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  return regex.test(value.trim());
};

export default validateNameFormat;
