/* eslint-disable no-multi-str */
/* eslint-disable max-len */
module.exports = config => [
  {
    question: 'Je souhaite être retiré du dispositif, comment faire\u00A0?',
    answer: `Pour être retiré du dispositif Santé Psy Étudiant, envoyez-nous un email \
    à <a href="mailto:${config.contactEmail}">${config.contactEmail}</a> \
    En nous indiquant votre volonté d'être retiré du dispositif et en précisant si vous avez déjà effectué des séances.`,
  },
];
