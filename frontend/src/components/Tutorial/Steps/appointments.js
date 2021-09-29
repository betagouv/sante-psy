const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Déclarer une séance',
    content: "La page d'accueil vous permet de déclarer et de visualiser vos séances.",
  },
  {
    placement: 'top-start',
    target: '#new-appointment-button',
    content: "Pour ce faire, il suffit de cliquer sur ce bouton et de preciser la date de la séance ainsi que l'étudiant concerné.",
  },
  {
    placement: 'top-start',
    target: '#appointments-table',
    content: "Un récapitulatif de vos séances apparaîtra alors sur cette page, vous pouvez les modifier ou les supprimer en cas d'erreur.",
  },
  {
    placement: 'top-start',
    target: '#appointment-month',
    content: 'Par soucis de lisibilité, nous vous montrons uniquement les séances du mois courant. Vous pouvez bien sûr voir les autres séances grâce à ce bouton.',
  },
];

export default steps;
