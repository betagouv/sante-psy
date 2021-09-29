const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Nouvelle séance',
    content: 'Cette page vous permet de déclarer une nouvelle séance.',
  },
  {
    placement: 'top-start',
    target: '#patients-list',
    content: "Tout d'abord, veuillez séléctionner l'étudiant qui participe à la séance.",
  },
  {
    placement: 'top-start',
    target: '#new-patient',
    content: "Si c'est la première fois que vous voyez cet étudiant, commencez par l'ajouter à vos étudiant.",
  },
  {
    placement: 'top-start',
    target: '#new-appointment-date-input',
    content: 'Renseignez ici la date du rendez-vous.',
  },
  {
    placement: 'top-start',
    target: '#new-appointment-submit',
    content: "Vous n'avez plus qu'à valider la séances. Et si vous vous êtes trompé, ne vous inquietez pas, la séance peut être supprimée et recréee.",
  },
];

export default steps;
