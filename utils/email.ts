import nodemailer, { SendMailOptions } from 'nodemailer';
import config from './config';

const mailTransport = nodemailer.createTransport({
  logger: config.mail.debug,
  debug: config.mail.debug,
  host: config.mail.host,
  port: config.mail.port,
  ignoreTLS: !config.mail.requireTLS,
  requireTLS: config.mail.requireTLS,
  secure: config.mail.secure,
  auth: {
    user: config.mail.auth.user,
    pass: config.mail.auth.pass,
  },
});

const send = (
  toEmail: string,
  subject: string,
  html: string,
  attachments?: Array<{ filename: string; content: Buffer }>,
  ccEmail = '',
  bccEmail = '',
): Promise<void> => {
  const mail: SendMailOptions = {
    to: toEmail,
    cc: ccEmail,
    bcc: bccEmail,
    from: `${config.appName} <${config.sendingEmail}>`,
    replyTo: config.contactEmail,
    subject,
    html,
    text: html.replace(/<(?:.|\n)*?>/gm, ''),
    headers: { 'X-Mailjet-TrackOpen': '0', 'X-Mailjet-TrackClick': '0' },
    attachments,
  };

  return new Promise((resolve, reject) => {
    mailTransport.sendMail(mail, (error, info) => (error ? reject(error) : resolve(info)));
  });
};

export default send;
