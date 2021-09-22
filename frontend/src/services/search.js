const matchFilter = (value, filter) => value && value.toLowerCase().includes(filter.trim().toLowerCase());

const removeStreet = address => {
  if (!address) {
    return '';
  }
  const res = address.split(/(?=[0-9]{5})/);
  return res.length > 1 ? res[res.length - 1] : '';
};

const matchDepartment = (address, filter) => !!removeStreet(address).startsWith(filter);

const matchZipCodeOrCity = (address, filter) => !!matchFilter(removeStreet(address), filter);

module.exports = {
  matchFilter,
  matchDepartment,
  matchZipCodeOrCity,
};
