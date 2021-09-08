/* eslint-disable no-multi-str */
/* eslint-disable max-len */
module.exports = config => [
  {
    question: "Puis-je recevoir des étudiants d'autres universités et/ou de départements\u00A0?",
    answer: "Oui, vous avez la possibilité de prendre des étudiants quel que soit \
    leur école\u00A0/ université (privé ou public), \
    leur département ou lieu de résidence tant qu'ils rentrent dans les critères d'éligibilité.",
  },
  {
    question: "Mon étudiant n'a pas de numéro INE, que faire\u00A0?",
    answer: "Le numéro INE est facultatif. \
    L'étudiant doit seulement vous présenter sa carte d'étudiant et sa lettre d'orientation de son médecin généraliste.",
  },
  {
    question: 'Qu\'est ce que les "chèques psy" (aussi appelé "pass santé psy")\u00A0?',
    answer: 'Le terme "chèque psy" est employé par la ministre de l\'Enseignement Supérieur et de la Recherche. \
    Il indique l\'accès aux 3 séances renouvelable 1 fois par la lettre d\'orientation du médecin généraliste.',
  },
  {
    question: 'Je reçois trop de demande, comment faire\u00A0?',
    answer: `Vous êtes en droit de refuser des étudiants si vous ne pouvez pas répondre à toutes les demandes. \
    Vous pouvez également être temporairement retiré de l'annuaire publique des psychologues partenaires. \
    Pour cela, envoyez nous un email à <a href="mailto:${config.contactEmail}">${config.contactEmail}</a> nous le précisant.`,
  },
  {
    question: 'Quelles informations dois-je vérifier auprès du étudiant lors de la séance\u00A0?',
    answer: 'Lors de chaque séance, vous devez renseigner les identités du médecin adresseur et de l’étudiant tout en confirmant que la séance a eu lieu. \
    Cette information permet au SSU de suivre la situation de l’étudiant concerné et à l’administration de l’établissement \
    (qui n’a pas accès aux informations concernant l’étudiant) de s’assurer du service fait qui permet de déclencher le paiement.',
  },
  {
    question: "Mon étudiant n'a pas de carte d'étudiant. Que puis-je faire\u00A0?",
    answer: "Les étudiants doivent présenter un justificatif d'inscription en études supérieures\u00A0: carte étudiante, certificat de scolarité ou autre document.",
  },
  {
    question: 'Quelle est la date prévue de fin du dispositif Santé Psy Étudiant\u00A0?',
    answer: "Comme explicité dans votre convention, le dispositif continue sous sa forme actuelle jusqu'au 31 décembre 2021. Plus de détails à venir pour la suite de l'année scolaire 2021/2022.",
  },
];
