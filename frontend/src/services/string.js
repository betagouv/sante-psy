const prefixUrl = value => {
  if (value && value.replace(/ /g, '') !== '') {
    return value.replace(/^(?!https?:\/\/)/, 'http://');
  }
  return undefined;
};

module.exports = { prefixUrl };
