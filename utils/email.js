const config = require('./config');
const nodemailer = require('nodemailer');

const mailTransport = nodemailer.createTransport({
  debug: process.env.MAIL_DEBUG === 'true',
  service: process.env.MAIL_SERVICE ? process.env.MAIL_SERVICE : null,
  host: process.env.MAIL_SERVICE ? null : process.env.MAIL_HOST,
  port: process.env.MAIL_SERVICE ? null : parseInt(process.env.MAIL_PORT || '25', 10),
  ignoreTLS: process.env.MAIL_SERVICE ? null : process.env.MAIL_IGNORE_TLS === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


module.exports.isValidEmail = (email) => {
  return email === undefined || !/^[a-z0-9_-]+\.[a-z0-9_-]+$/.test(email)
}

module.exports.sendMail = async function sendMail(toEmail, subject, html, extraParams = {}) {
  const mail = {
    to: toEmail,
    from: `Santé Psy Étudiants <${config.contactEmail}>`,
    subject,
    html,
    text: html.replace(/<(?:.|\n)*?>/gm, ''),
    headers: { 'X-Mailjet-TrackOpen': '0', 'X-Mailjet-TrackClick': '0' },
    ...extraParams,
  };

  return new Promise((resolve, reject) => {
    mailTransport.sendMail(mail, (error, info) => (error ? reject(error) : resolve(info)));
  });
};
