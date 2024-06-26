/* eslint-disable no-multi-str */
/* eslint-disable max-len */
module.exports = config => [
  {
    question:
      'Je souhaiterais m’inscrire sur la liste des psychologues habilités à recevoir les étudiants qui \
      souhaitent bénéficier du dispositif d’accompagnement. Quelles démarches dois-je effectuer\u00A0?',
    answer: `Pour participer au dispositif Santé Psy Étudiant, les psychologues doivent en faire la demande en renseignant un formulaire \
      <a href="${config.demarchesSimplifieesUrl}" target="_blank" rel="noopener noreferrer">(cliquez ici pour accéder au formulaire)</a>. \
      Le service de santé étudiante (SSE) le plus proche de votre lieu d’exercice procédera à l’examen de votre demande. \
      Si elle est conforme aux critères retenus, votre demande sera agréée et vous serez invité(e) à signer une convention \
      (destinée à définir les conditions de votre participation au dispositif et les modalités de règlement des consultations effectuées) \
      avec l’université à laquelle le SSE est rattaché. Vos coordonnées seront publiées sur la liste des psychologues participant au dispositif. \
      Les étudiants choisiront parmi celles et ceux inscrits sur cette liste et prendront directement rendez-vous avec celle ou celui qu’ils ont choisi(e).`,
    frequent: true,
  },
  {
    question: 'Puis-je proposer ma participation au dispositif uniquement par consultations vidéo\u00A0?',
    answer:
      'Dans ce cas, votre demande sera examinée par le service médical étudiant (SSE) \
      proche de votre lieu d’exercice qui déterminera, avec le concours de la fédération française des psychologues et de psychologie, \
      si l’offre exclusive de téléconsultation que vous proposez convient.',
  },
  {
    question: 'N’ayant pas de cabinet professionnel, puis-je me déplacer au domicile des étudiants\u00A0?',
    answer:
      'Le dispositif Santé Psy Étudiant prévoit deux modalités de consultation\u00A0: \
      au cabinet du psychologue ou en téléconsultation. Le déplacement au domicile de l’étudiant n’est pas prévu. \
      Il peut être une option mais pas un mode principal de consultation.',
  },
  {
    question: 'Puis-je participer au dispositif si je n’ai pas 3 ans d’ancienneté\u00A0?',
    answer:
      'L’expérience requise de trois ans, calculée à partir de la date d’obtention du diplôme, \
      est une condition impérative pour pouvoir participer au dispositif, condition qui a été retenue après une large \
      consultation des professionnels concernés (psychologues, médecins, etc.).',
  },
  {
    question: 'Je ne dispose pas de numéro Adeli mais d’un numéro SIRET. Puis-je participer au dispositif\u00A0?',
    answer:
      'Le numéro ADELI est obligatoire car il permet d’attester que son détenteur est autorisé à faire usage du titre de psychologue. \
      Il constitue donc, pour les services de santé étudiante, une garantie importante préalable à l’agrément, \
      complémentaire aux trois années d’expérience requises. Le numéro SIRET n’offre pas une telle garantie.',
  },
  {
    question:
      'Quels sont les psys concernés\u00A0? Uniquement psychologue\u00A0? Psychiatre aussi\u00A0? Psychanalyste\u00A0?',
    answer:
      'Le dispositif prévoit de mobiliser celles et ceux qui disposent du titre réglementé de psychologue et \
      d’une expérience d’au moins trois ans. Certains psychologues détiennent d’autres qualifications qu’ils peuvent mentionner dans le formulaire à remplir. \
      Les psychiatres relèvent d’un régime de remboursement aux étudiants de leurs actes par l’assurance maladie. \
      Ils n’ont donc pas vocation à intégrer le dispositif Santé Psy Étudiant.',
  },
];
