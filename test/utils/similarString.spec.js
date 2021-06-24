const { default: areSimilar } = require('../../utils/similarString');

describe('String utils', () => {
  const tests = [
    { value1: 'hello you', value2: 'hello you', result: true },
    { value1: 'HELLO you', value2: 'HeLlo yOu', result: true },
    { value1: 'heL- l-o yOu', value2: 'hello you', result: true },
    { value1: 'HELLOYOU', value2: 'hello you  ', result: true },
    { value1: 'hello_you', value2: 'hello you  ', result: false },
    { value1: 'hello me', value2: 'hello you  ', result: false },
    { value1: 'Léa', value2: 'lea', result: true },
    { value1: 'Léa', value2: 'Lèa', result: true },
    { value1: 'Léa', value2: 'Làa', result: false },
    { value1: 'Loùloù', value2: 'LOULOU', result: true },
  ];

  tests.forEach((test) => {
    it(`Should return ${test.result} for ${test.value1} and ${test.value2}`, () => {
      const result = areSimilar(test.value1, test.value2);
      result.should.equals(test.result);
    });
  });
});
