const simplify = (value: string) : string => value
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  .normalize('NFD')
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
  .replace(/\p{Diacritic}/gu, '')
  .replace(/[ -]/g, '')
  .toLowerCase();

const areSimilar = (value1: string, value2: string): boolean => simplify(value1) === simplify(value2);

export default areSimilar;
