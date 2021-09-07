/* eslint-disable no-multi-str */
/* eslint-disable max-len */
module.exports = config => [
  {
    question: "Je n'arrive pas à entrer mes séances sur la plateforme. Comment faire ?",
    answer: `Selon votre demande, assurez-vous de bien lire tous les onglets pour déclarer vos séances. \
    Une fois cela établi, si votre problème persiste, envoyez-nous un email à <a href="mailto:${config.contactEmail}">${config.contactEmail}</a>`,
  },
  {
    question: 'Je souhaite modifier des informations sur mon espace. Comment puis-je faire ?',
    answer: `Pour modifier vos informations, envoyez-nous un email à <a href="mailto:${config.contactEmail}">${config.contactEmail}</a> \
    pour repasser votre dossier "en construction". Sachez toutefois que pendant ce temps, \
    vous n’apparaîtrez plus sur l'annuaire, et vous ne pourrez pas déclarer vos séances. Une fois les modifications effectuées,nous vous invitons à nous renvoyer un email de confirmation afin de réactiver votre dossier.`,
  },
  {
    question: 'Je ne parviens pas à accéder à mon espace psychologue. Que puis-je faire ?',
    answer: `Si vous rencontrez des problèmes de connexion\u00A0: \
    <ul>\
    <li>\
    L'email n'est pas reconnu\u00A0: assurez-vous que votre email de connexion correspond à celui utilisé lors de votre inscription. Il peut être différent de votre email de contact présenté dans l‘annuaire des psychologues.\
    </li>\
    <li>\
    Si vous ne recevez pas l'email de connexion sur votre boite mail\u00A0: vérifier vos spams et ajouter l'adresse ${config.contactEmail} à votre carnet d'adresse email. \
    </li>\
    <li>\
    Si vous recevez l'email de connexion mais le lien ne s'ouvre pas, veuillez nous contacter.\
    </li>\
    </ul>\
    `,
  },
];
