import agent from 'services/agent';

const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Gérer mes étudiants',
    content: "Cette page vous permet d'ajouter et de visualiser les étudiants.",
  },
  {
    placement: 'auto',
    target: '#new-student-button',
    content: "Pour enregistrer un nouvel étudiant, cliquer sur ce bouton et renseigner les informations de l'étudiant.",
  },
  {
    placement: 'auto',
    target: '#students-table',
    shouldSkip: () => agent.Patient.get().then(students => students.length > 0),
    content: "Les étudiants enregistrés apparaîtront ici, vous pourrez les supprimer en cas d'erreur ou modifier leurs informations.",
  },
  {
    placement: 'auto',
    target: '#students-table',
    shouldSkip: () => agent.Patient.get().then(students => students.length === 0),
    content: 'Ce tableau liste tous les étudiants que vous avez enregistré, le statut de leur dossier et le nombre total de séances que vous avez déclaré pour lui/elle.',
  },
  {
    placement: 'auto',
    target: '#students-table',
    shouldSkip: () => agent.Patient.get().then(students => students.length === 0),
    content: 'Vous pouvez déclarer une nouvelle séance, compléter un dossier ou supprimer un étudiant qui aurait été enregistré par erreur.',
  },
];

export default steps;
