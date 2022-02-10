const get = () => {
  const defaultBillingInfo = window.localStorage.getItem('billingInfo');
  return defaultBillingInfo
    ? JSON.parse(defaultBillingInfo)
    : {
      siret: '',
      billingNumber: '',
      address1: '',
      address2: '',
      orderNumber: '',
      iban: '',
    };
};

const save = billingInfo => {
  window.localStorage.setItem('billingInfo', JSON.stringify(billingInfo));
};

export default { get, save };
