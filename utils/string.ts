const simplify = (value: string) : string => value.replace(/[ -]/g, '').toLowerCase();

const areSimilar = (value1: string, value2: string): boolean => simplify(value1) === simplify(value2);

export default {
  areSimilar,
};
