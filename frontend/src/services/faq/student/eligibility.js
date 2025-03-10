/* eslint-disable no-multi-str */
/* eslint-disable max-len */
module.exports = () => [
  {
    question: 'Suis-je éligible au dispositif\u00A0?',
    answer:
      '<a href="https://santepsy.etudiant.gouv.fr/eligibilite" target="_blank" rel="noopener noreferrer">Vérifier mon éligibilité</a>',
  },
  {
    question: "Quels sont les critères d'éligibilité pour bénéficier du dispositif Santé Psy Étudiant\u00A0?",
    answer:
      "Le dispositif Santé Psy Étudiant est accessible à tous les étudiants inscrits dans un établissement d'enseignement supérieur reconnu par le Ministère de l'Enseignement supérieur et de la Recherche (ou un ministère en lien avec celui-ci). Il concerne tout type d'établissement, qu'il soit public ou privé, quel que soit le lieu de scolarité, le statut de l'école\u00A0/ université ou bien encore le lieu de résidence de l'étudiant.",
  },
  {
    question: "J'ai déjà un suivi. Puis-je cependant bénéficier du dispositif\u00A0?",
    answer:
      'Les étudiants qui ont déjà un suivi sont éligibles au dispositif Santé Psy Étudiant. Ils devront cependant pour cela aller consulter un psychologue partenaire du dispositif.',
  },
  {
    question: "Je n'ai pas de numéro INE mais j'ai bien une carte étudiante.",
    answer:
      "Depuis le 1er janvier 2025, le numéro INE est obligatoire. Si vous êtes étudiant dans le supérieur, vous pouvez vous rapprocher de l'administration de votre école afin de récupérer votre numéro INE.",
  },
  {
    question: 'Je ne suis pas de nationalité française, mais étudiant en France. Suis-je éligible au dispositif\u00A0?',
    answer: `
      Le dispositif Santé Psy Étudiant concerne tous les étudiants inscrits dans un établissement d‘enseignement supérieur français 
      (<a href="https://santepsy.etudiant.gouv.fr/eligibilite" target="_blank" rel="noopener noreferrer">Vérifier mon éligibilité</a>), 
      sans considération de nationalité. La liste des psychologues participant au dispositif publiée sur le site 
      <a href="https://santepsy.etudiant.gouv.fr" target="_blank" rel="noopener noreferrer">https://santepsy.etudiant.gouv.fr</a> 
      précise les langues pratiquées par ces derniers.
    `,
  },
  {
    question: "Je suis de nationalité française, mais étudiant à l'étranger. Suis-je éligible au dispositif\u00A0?",
    answer: `
      Cela dépend de votre inscription, si vous avez un certificat de scolarité dépendant d'une université ou école française. 
      <a href="https://santepsy.etudiant.gouv.fr/eligibilite" target="_blank" rel="noopener noreferrer">Vérifier votre éligibilité</a>. 
      L‘ensemble des psychologues participant au dispositif sont cependant uniquement localisés en France, mais plusieurs permettent la téléconsultation.
    `,
  },
  {
    question: 'Je ne suis pas éligible au dispositif Santé Psy Étudiant. Que puis-je faire\u00A0?',
    answer:
      'Comme toute personne à partir de 3 ans, vous pouvez bénéficier du dispositif Mon Soutien Psy permettant l‘accès jusqu‘à 12 séances par an.',
  },
];
