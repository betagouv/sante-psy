import nodemailer from 'nodemailer';
import config from './config';

const mailTransport = nodemailer.createTransport({
  logger: config.mailDebug,
  debug: config.mailDebug,
  host: config.mailHost,
  port: config.mailPort,
  ignoreTLS: !config.isSecure,
  requireTLS: config.isSecure,
  secure: config.isSecure,
  auth: {
    user: config.auth.user,
    pass: config.auth.pass,
  },
});

const send = (toEmail: string, subject: string, html: string, ccEmail = '', bccEmail = ''): Promise<void> => {
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

export default send;
