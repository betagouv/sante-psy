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
    answer: 'Pour vous connecter, vous devez vous rendre sur la page \
    <a href="/psychologue/login">Se connecter en tant que psychologue</a> \
    Vous serez redirigée sur une page de connexion sur laquelle vous allez devoir renseigner \
    votre adresse email personnelle, renseignée dans le formulaire d\'inscription déjà rempli, \
    et vous recevrez sur cette adresse, un mail de notre part avec un bouton sur lequel cliquer. \
    Vous serez alors connectée sur votre espace pour déclarer vos séances.',
  },
];
