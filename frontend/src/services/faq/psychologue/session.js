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
    Il indique l\'accès aux 8 séances par la lettre d\'orientation du médecin généraliste.',
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
    answer: "Le dispositif Santé Psy Étudiant est prévu jusqu'au 31 août 2022. Dans cette période de transition vers un dispositif de droit commun, vous pouvez donc poursuivre vos suivis jusqu'à cette date.",
  },
  {
    question: 'Le dispositif s\'arrête-t-il au 31 décembre 2021 et jusqu\'à quand puis-je recevoir des étudiants\u00A0?',
    answer: 'Le dispositif se poursuit sur l\'année universitaire 2021/2022 soit jusqu\'au 31 août 2022. Vous pouvez donc \
    poursuivre votre suivi jusqu\'à cette date. L\'université vous tiendra informée des modalités de prolongation concernant \
    votre convention.',
  },
  {
    question: 'La lettre d\'orientation est-elle obligatoire\u00A0?',
    answer: 'Oui la lettre d\'orientation est obligatoire pour démarrer les séances. Toutefois la lettre d\'orientation après \
    la 3ème séance a été levée, de ce fait l\'étudiant peut directement poursuivre jusqu\'à 8 séances sans repasser par un \
    médecin généraliste.',
  },
  {
    question: 'Que faire lorsqu\'un étudiant annule sa consultation\u00A0?',
    answer: 'Lorsqu\'un étudiant annule sa consultation, le remboursement n\'est malheureusement pas comptabilisé, \
    seules les séances effectuées doivent être déclarées. Le paiement n\'étant effectué qu\'après un service fait. \
    Toutefois, vous pouvez prévenir l\'étudiant qu\'en cas de séance non honorée et sans excuse valable, \
    vous pouvez vous réserver le droit de refuser l\'étudiant.',
  },
];
