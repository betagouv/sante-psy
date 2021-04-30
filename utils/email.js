const config = require('./config');
const nodemailer = require('nodemailer');

const mailTransport = nodemailer.createTransport({
  debug: config.mailDebug,
  service: config.mailService,
  host: config.mailHost,
  port: config.mailPort,
  ignoreTLS: config.ignoreTLS,
  secure: false, // todo use config.isSecure
  auth: {
    user: config.auth.user,
    pass: config.auth.pass,
  },
});


module.exports.sendMail = async function sendMail(toEmail, subject, html, ccEmail = '', bccEmail= '') {
  const mail = {
    to: toEmail, // Comma separated list or an array
    cc: ccEmail, // Comma separated list or an array
    bcc: bccEmail, // Comma separated list or an array
    from: `${config.appName} <${config.contactEmail}>`,
    subject,
    html,
    text: html.replace(/<(?:.|\n)*?>/gm, ''),
    headers: { 'X-Mailjet-TrackOpen': '0', 'X-Mailjet-TrackClick': '0' },
  };

  return new Promise((resolve, reject) => {
    mailTransport.sendMail(mail, (error, info) => (error ? reject(error) : resolve(info)));
  });
};
