const steps = [
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
];

export default steps;
