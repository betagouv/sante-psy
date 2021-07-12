const items = {
  etudiant: {
    index: 0,
    label: 'étudiants',
    links: [
      {
        href: '/static/documents/parcours_etudiant_sante_psy_etudiant.pdf',
        title: 'Parcours étudiant',
      },
      {
        href: '/static/documents/flyer_etudiants_fr.pdf',
        title: 'Voir le dépliant étudiants',
      },
      {
        href: '/static/documents/flyer_etudiants_en.pdf',
        title: 'See the student flyer',
      },
      {
        href: '/static/documents/flyer_etudiants_sp.pdf',
        title: 'Ver el folleto del estudiante',
      },
      {
        href: '/static/documents/flyer_etudiants_zn.pdf',
        title: '见学生传单',
      },
    ],
    sections: [
      { title: 'Éligibilité', name: 'eligibility' },
      { title: 'Paiement', name: 'payment' },
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
  medecin: {
    index: 2,
    label: 'médecins',
    links: [
      {
        href: '/static/documents/flyer_medecins.pdf',
        title: 'Voir le dépliant médecins',
      },
      {
        href: '/static/documents/flyer_ssu.pdf',
        title: 'Voir le dépliant SSU',
      },
    ],
    sections: [
      { title: 'Divers', name: 'doctor' },
    ],
  },
};

export default items;
