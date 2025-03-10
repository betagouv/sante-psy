const items = {
  etudiant: {
    index: 0,
    label: 'étudiants',
    sections: [
      { title: 'Éligibilité', name: 'eligibility' },
      { title: 'Prendre rendez-vous', name: 'studentProcess' },
      { title: 'Séances', name: 'session' },
      { title: 'Problème avec un psychologue', name: 'problem' },
    ],
  },
  psychologue: {
    index: 1,
    label: 'psychologues',
    links: [
      {
        href: '/static/documents/parcours_psychologue_sante_psy_etudiant.pdf',
        title: 'Parcours psychologue',
      },
      {
        href: '/static/documents/flyer_psychologues.pdf',
        title: 'Voir le dépliant',
      },
    ],
    sections: [
      { title: 'Éligibilité', name: 'psyEligibility' },
      { title: 'Connexion', name: 'connection' },
      { title: 'Déroulé des séances', name: 'psySession' },
      { title: 'Déclaration des séances, prix', name: 'reimbursement', id: 'remboursement' },
      { title: 'Facturation', name: 'billing' },
      { title: 'Inscription', name: 'registration' },
      { title: 'Conventionnement', name: 'agreement' },
      { title: 'Rétractation', name: 'retractation' },
    ],
  },
  ecole: {
    index: 2,
    label: 'SSE - Écoles',
    sections: [
      { title: 'Éligibilité des mes étudiants', name: 'schoolEligibility' },
      { title: 'Conventionnement des psychologues', name: 'schoolConvention' },
      { title: 'Facturation et remboursement', name: 'schoolBilling' },
      { title: 'Devenir université partenaire', name: 'schoolJoin' },
      { title: 'Données statistiques', name: 'schoolStatistics' },
    ],
  },
};

export default items;
