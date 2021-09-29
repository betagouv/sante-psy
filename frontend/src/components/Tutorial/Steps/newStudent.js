const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Nouvel étudiant',
    content: "Avant de pouvoir déclarer une séance, il est nécéssaire d'enregister des informations sur l'étudiant.",
  },
  {
    placement: 'top-start',
    target: '#mandatory-informations',
    content: "Le nom, prénom et date de naissance sont obligatoires pour identifier l'étudiant.",
  },
  {
    placement: 'top-start',
    target: '#other-informations',
    content: "Vous pouvez passer le reste des informations si vous ne les avez pas, mais c'est dernière seront nécéssaire pour être rapidement remboursé.",
  },
  {
    placement: 'top-start',
    target: '#save-etudiant-button',
    content: 'Une fois les informations remplies, vous pouvez valider et déclarer une séance avec cet étudiant.',
  },
];

export default steps;
