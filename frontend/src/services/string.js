const prefixUrl = value => {
  if (value && value.replace(/ /g, '') !== '') {
    return value.replace(/^(?!https?:\/\/)/, 'http://');
  }
  return undefined;
};

const displayStatistic = value => {
  if (value.length < 3) {
    return value;
  }
  const result = value.slice(0, 2) + String('0').repeat(value.length - 2);
  return result.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

module.exports = { prefixUrl, displayStatistic };
