// TODO : this is copied from audioconf. Make it a separate package to reuse ?
// Julien : good idea

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

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', year: 'numeric',
  month: 'long', day: 'numeric',
  hour: 'numeric', minute: 'numeric',
})
const GMTString = offset => {
  const GMT = (-offset/60)
  if (GMT === 0) {
    return 'GMT'
  }
  if ( GMT > 0 ) {
    return 'GMT+' + GMT
  }
  if ( GMT < 0 ) {
    return 'GMT' + GMT
  }
}
module.exports.GMTString = GMTString
const serverTimezoneOffset = new Date().getTimezoneOffset()

module.exports.formatFrenchDateTime = (date) => dateTimeFormatter.format(date) + ' ' + GMTString(serverTimezoneOffset)

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', year: 'numeric',
  month: 'long', day: 'numeric',
})

module.exports.formatFrenchDate = date => dateFormatter.format(date)


const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric',
})
module.exports.formatShortFrenchDate = date => shortDateFormatter.format(date)

module.exports.formatStandardDate = date => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDate() + '').padStart(2, '0')
  return `${year}-${month}-${day}`
}

module.exports.formatMinutesInHours = minutes =>
  `${Math.floor(minutes/60)} heure${ minutes >= 120 ? 's' : ''}`


