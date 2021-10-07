import agent from 'services/agent';

const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Mes informations',
    content: "Depuis cette page, vous pouvez gérer vos informations personelles ainsi que les informations visibles sur l'annuaire",
  },
  {
    placement: 'top-start',
    target: '#convention-form',
    shouldSkip: user => Promise.resolve(user.convention),
    content: "Il est important de nous signaler quand votre convention est signée. N'oubliez pas de mettre ce champ à jour.",
  },
  {
    placement: 'top-start',
    target: '#show-convention-form',
    shouldSkip: user => Promise.resolve(!user.convention || user.convention.isConventionSigned),
    content: "Ce bouton nous permet de suivre l'état de votre convention. Il est important de nous signaler quand celle-ci est signée.",
  },
  {
    placement: 'top-start',
    target: '#show-profile-form-button',
    content: "Pour être visible sur l'annuaire (et être correctement référencé) : pensez à compléter votre profil. La description permet aux étudiants de connaître vos spécialités, le cas échéant.",
  },
  {
    placement: 'top-start',
    target: '#show-public-profile-button',
    shouldSkip: () => agent.Psychologist.getProfile().then(psychologist => !psychologist.active),
    content: 'Pour voir ce à quoi les étudiants ont accès, vous pouvez cliquer sur ce bouton.',
  },
  {
    placement: 'top-start',
    target: '#hide-profil-button',
    content: "Enfin, si vous ne souhaitez plus être visible sur l'annuaire, veuillez cliquer ici.",
  },
];

export default steps;
