const cleanValue = value => value
  .replace(/é/g, 'e')
  .replace(/ç/g, 'c')
  .replace(/-/g, ' ')
  .trim()
  .toLowerCase();
const matchFilter = (value, filter) => value && cleanValue(value).includes(cleanValue(filter));

const removeStreet = address => {
  if (!address) {
    return '';
  }
  const res = address.split(/(?=[0-9]{5})/);
  return res.length > 1 ? res[res.length - 1] : res[0];
};

const matchDepartment = (address, filter) => !!removeStreet(address).startsWith(filter);

const matchZipCodeOrCity = (address, filter) => !!matchFilter(removeStreet(address), filter);

const matchName = (psychologist, filter) => {
  const searchedNames = filter.split(' ');
  const psychologistNames = [psychologist.lastName, ...psychologist.firstNames.split(' ')];

  return searchedNames
    .every(searchedName => psychologistNames
      .some(psychologistName => matchFilter(psychologistName, searchedName)));
};

module.exports = {
  matchFilter,
  matchName,
  matchDepartment,
  matchZipCodeOrCity,
};
