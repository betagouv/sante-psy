const items = {
  etudiant: {
    index: 0,
    label: 'étudiants',
    sections: [
      { title: 'Éligibilité', name: 'eligibility' },
      { title: 'Paiement', name: 'payment' },
      { title: 'Déroulé', name: 'studentProcess' },
      { title: 'Séance', name: 'session' },
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
      { title: 'Inscription', name: 'registration' },
      { title: 'Connexion', name: 'connection' },
      { title: 'Prix de la séance et remboursement', name: 'reimbursement', id: 'remboursement' },
      { title: 'Déroulé', name: 'process' },
      { title: 'Conventionnement', name: 'agreement' },
      { title: 'Séance', name: 'psySession' },
      { title: 'Facturation', name: 'billing' },
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
