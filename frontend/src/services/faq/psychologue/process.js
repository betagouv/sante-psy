/* eslint-disable no-multi-str */
/* eslint-disable max-len */
module.exports = config => [
  {
    question: 'Je suis déjà des étudiants. Puis-je continuer à les suivre dans le cadre du dispositif Santé Psy Étudiant\u00A0?',
    answer: `Si les étudiants que vous prenez en charge actuellement souhaitent bénéficier du dispositif et \
    poursuivre leur consultation avec vous, vous devez être agréé pour participer au dispositif\u00A0: \
    renseignez le formulaire en ligne <a href="${config.demarchesSimplifieesUrl}" target="_blank" rel="noopener noreferrer">(cliquez ici pour accéder au formulaire)</a>. \
    Si vous remplissez les conditions de participation et acceptez les modalités de prise en charge des étudiants (tarif, lien avec le corps médical notamment), \
    une convention avec l’université la plus proche de votre lieu d’exercice vous sera proposée et vous serez inscrit sur la liste des psychologues \
    mise à disposition des étudiants.`,
  },
  {
    question: 'Les étudiants peuvent-ils directement venir voir le psychologue\u00A0?',
    answer: "Oui. Depuis le 1er juillet 2024, les étudiants n'ont plus besoin de présenter une lettre d'orientation d'un médecin généraliste et peuvent contacter directement un psychologue du dispositif pour prendre rendez-vous.",
  },
];
