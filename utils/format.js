// TODO : this is copied from audioconf. Make it a separate package to reuse ?

// eslint-disable-next-line no-global-assign
Intl = require('intl') // Use a polyfill for when node doesn't have locales installed

// OVH uses format '00339112233', we want '09 11 22 33' for humans
module.exports.formatFrenchPhoneNumber = machineReadableNumber => {
  const lastNineDigits = machineReadableNumber.slice(-9)
  const withPrefix = '0' + lastNineDigits
  const splitByPairs = withPrefix.substring(0, 2)
      + ' ' + withPrefix.substring(2, 4)
      + ' ' + withPrefix.substring(4, 6)
      + ' ' + withPrefix.substring(6, 8)
      + ' ' + withPrefix.substring(8, 10)
  return splitByPairs
}