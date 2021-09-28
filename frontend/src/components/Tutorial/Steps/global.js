import agent from 'services/agent';

const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Bienvenue sur votre espace psychologue',
    content: 'Nous allons vous guider à travers les fonctionnalités de base du site. Cette démo durera environ 2 minutes, vous pouvez la passer et revenir dessus à tout moment !',
  },
  {
    placement: 'center',
    target: 'body',
    title: 'Déclarer une séance',
    content: 'Cette page vous permet de déclarer et de visualiser vos séances.',
  },
  {
    placement: 'auto',
    target: '#new-appointment-button',
    content: "Pour ce faire, il suffit de cliquer sur ce bouton et de preciser la date de la séance ainsi que l'étudiant concerné.",
  },
  {
    placement: 'auto',
    target: '#appointments-table',
    shouldSkip: () => agent.Appointment.get().then(appointments => appointments.length > 0),
    content: "Un récapitulatif de vos séances apparaîtra alors sur cette page, vous pourrez les supprimer et les recréer en cas d'erreur.",
  },
  {
    placement: 'auto',
    target: '#appointments-table',
    shouldSkip: () => agent.Appointment.get().then(appointments => appointments.length === 0),
    content: "Le tableau ci-dessous montre les séances effectuées ce mois-ci, vous pouvez les supprimer et les recréer en cas d'erreur.",
  },
  {
    placement: 'auto',
    target: '#appointment-month',
    content: 'Par soucis de lisibilité, nous vous montrons uniquement les séances du mois courant. Vous pouvez bien sûr voir les autres séances grâce à ce bouton.',
  },
  {
    placement: 'auto',
    target: '#billing-header',
    content: "Une fois vos séances déclarées, vous pourrez générer vos factures depuis ce menu. Pensez à vérifier l'exactitude des informations déclarées. Les erreurs de déclaration peuvent entraîner des retards de paiement.",
  },
  {
    placement: 'auto',
    target: '#informations-header',
    content: "Ce menu permet de gérer votre visibilité sur l'annuaire pour les étudiants.",
    onNext: history => { history.push('/psychologue/mon-profil'); },
    onPrevious: history => { history.push('/psychologue/mes-seances'); },
  },
  {
    placement: 'auto',
    target: '#convention-form',
    shouldSkip: user => Promise.resolve(user.convention),
    content: "Il est important de nous signaler quand votre convention est signée. N'oubliez pas de mettre ce champ à jour.",
  },
  {
    placement: 'auto',
    target: '#convention-button',
    shouldSkip: user => Promise.resolve(!user.convention || user.convention.isConventionSigned),
    content: "Ce bouton nous permet de suivre l'état de votre convention. Il est important de nous signaler quand celle-ci est signée.",
  },
  {
    placement: 'auto',
    target: '#change-profil-button',
    content: "Pour être visible sur l'annuaire (et être correctement référencé) : pensez à compléter votre profil. La description permet aux étudiants de connaître vos spécialités, le cas échéant.",
  },
  {
    placement: 'auto',
    target: '#view-profil-button',
    content: 'Pour voir ce à quoi les étudiants ont accès, vous pouvez cliquer sur ce bouton.',
  },
  {
    placement: 'auto',
    target: '#hide-profil-button',
    content: "Enfin, si vous ne souhaitez plus être visible sur l'annuaire, veuillez cliquer ici.",
  },
  {
    placement: 'auto',
    target: '#faq-button',
    content: 'Ce tour est maintenant fini. Si vous avez la moindre question, consulter la foire aux questions',
  },
  {
    placement: 'center',
    target: 'body',
    content: 'Merci pour votre investissement dans le dispositif Santé Psy Étudiant.',
  },
];

export default steps;
