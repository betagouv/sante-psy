const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Bienvenue sur votre espace psychologue',
    content: 'Nous allons vous guider à travers les fonctionnalités de base du site. Cette démo durera environ 5 minutes, vous pouvez la passer et revenir dessus à tout moment!',
  },
  {
    placement: 'center',
    target: 'body',
    title: 'Declarer une séance',
    content: "La page d'accueil vous permet de declarer vos séances.",
  },
  {
    placement: 'auto',
    target: '#new-appointment-button',
    content: "Pour ce faire, il suffit de cliquer sur ce bouton et de preciser la date de la séance ainsi que l'étudiant concerné.",
  },
  {
    placement: 'auto',
    target: '#appointments-table',
    content: "Un récapitulatif de vos séances apparaitra alors sur cette page, vous pouvez les modifier ou les supprimer en cas d'erreur.",
  },
  {
    placement: 'auto',
    target: '#appointment-month',
    content: 'Par soucis de lisibilité, nous vous montrons uniquement les séances du mois courant. Vous pouvez bien sur voir les autres séances grace à ce bouton.',
  },
  {
    placement: 'auto',
    target: '#billing-header',
    content: 'Une fois vos séances déclarées, vous pourrez générer vôtre facture depuis ce menu.',
  },
  {
    placement: 'auto',
    target: '#informations-header',
    content: "Ce menu permet de gérér votre visibilité sur l'annuaire pour les étudiants",
    onClick: history => { history.push('/psychologue/mon-profil'); },
  },
  {
    placement: 'auto',
    target: '#billing-month',
    content: 'Par default, la facture est générée pour le mois courant, vous pouvez facturer les mois précédents grâce à ce bouton.',
  },
  {
    placement: 'auto',
    target: '#billing-info',
    content: 'Commencer par remplir les informations de facturations en cliquant sur ce bouton.',
  },
];

export default steps;
