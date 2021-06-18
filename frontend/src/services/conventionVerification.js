const tokenName = 'conventionAnswer';

export const checkConvention = () => {
  window.localStorage.setItem(tokenName, new Date());
};

export const shouldCheckConventionAgain = () => {
  const lastCheck = window.localStorage.getItem(tokenName);
  if (!lastCheck) {
    return true;
  }

  const lastCheckDate = new Date(lastCheck);
  lastCheckDate.setMonth(lastCheckDate.getMonth() + 1);
  return lastCheckDate.getTime() < (new Date()).getTime();
};
