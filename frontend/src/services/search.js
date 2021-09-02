const ADDRESS_DELIMITER = ';';

const matchFilter = (value, filter) => value && value.toLowerCase().includes(filter.trim().toLowerCase());

const removeStreet = address => {
  const res = address.split(/(?=[0-9]{5})/);
  return res.length > 1 ? res[res.length - 1] : '';
};

const matchDepartment = (address, filter) => {
  const addresses = address.split(ADDRESS_DELIMITER);
  const res = addresses.find(a => removeStreet(a).startsWith(filter));
  return !!res;
};

const matchZipCodeOrCity = (address, filter) => {
  const addresses = address.split(ADDRESS_DELIMITER);
  const res = addresses.find(a => matchFilter(removeStreet(a), filter));
  return !!res;
};

export default {
  ADDRESS_DELIMITER,
  matchFilter,
  matchDepartment,
  matchZipCodeOrCity,
};
