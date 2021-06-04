/* eslint-disable max-len */
const message = (contactEmail) => `Madame, Monsieur, 

Merci pour votre confiance et votre participation au dispositif Santé Psy. 
Vos coordonnées sont désormais accessibles aux étudiants sur notre site, rubrique « trouver un psychologue ». 

Pour connaître les prochaines étapes, rendez-vous sur le lien suivant :
https://santepsy.etudiant.gouv.fr/static/documents/parcours_psychologue_sante_psy_etudiant.pdf

Une université partenaire va vous contacter dans les prochaines semaines afin d'établir une convention. C'est cette université qui réalisera le remboursement des séances effectuées et déclarées dans le cadre du dispositif. Dès à présent, vous pouvez recevoir des étudiants.

Pour déclarer vos séances à rembourser, connecter-vous à votre espace sur la plateforme : https://santepsy.etudiant.gouv.fr/psychologue/login

Pour toute question, nous vous invitons à consulter notre FAQ ou à nous écrire à ${contactEmail}
`;

module.exports = message;
