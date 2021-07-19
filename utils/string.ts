const simplify = (value: string) : string => value
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  .normalize('NFD')
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
  .replace(/\p{Diacritic}/gu, '')
  .replace(/[ -]/g, '')
  .toLowerCase();

const areSimilar = (value1: string, value2: string): boolean => simplify(value1) === simplify(value2);

const prefixUrl = (value: string) : string => {
  if (value && value.replace(/ /g, '') !== '') {
    return value.replace(/^(?!https?:\/\/)/, 'http://');
  }
  return undefined;
};

export default {
  areSimilar,
  prefixUrl,
};
