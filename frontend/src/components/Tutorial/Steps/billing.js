import agent from 'services/agent';

const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Gérer mes facturations',
    content: 'Cette page vous permet de gérér vos informations de facturation et de générer vos factures pour les Services de Santé Universitaire.',
  },
  {
    placement: 'top-start',
    target: '#no-convention-alert',
    shouldSkip: user => Promise.resolve(user.convention && user.convention.isConventionSigned),
    content: 'Avant de pouvoir accéder à vos informations de facturation, vous devez signer votre convention.',
  },
  {
    placement: 'top-start',
    target: '#no-appointments',
    shouldSkip: () => {
      const now = new Date();
      return agent.Appointment.get().then(appointments => appointments.some(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate.getFullYear() === now.getFullYear()
          && appointmentDate.getMonth() === now.getMonth();
      }));
    },
    content: "Vous n'avez pas déclarer de séances pour ce mois-ci, il n'y a donc pas de facture à générer. Commencez par déclarer des séances depuis l'onglet dédié ou générez une facture pour un autre mois.",
  },
  {
    placement: 'top-start',
    target: '#billing-table',
    shouldSkip: () => {
      const now = new Date();
      return agent.Appointment.get().then(appointments => appointments.every(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate.getFullYear() !== now.getFullYear()
          || appointmentDate.getMonth() !== now.getMonth();
      }));
    },
    content: 'Vous trouverez ici un tableau récapitulatif de vos séances avec les informations à faire apparaître sur votre facture.',
  },
  {
    placement: 'top-start',
    target: '#billing-info',
    shouldSkip: () => {
      const now = new Date();
      return agent.Appointment.get().then(appointments => appointments.every(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate.getFullYear() !== now.getFullYear()
          || appointmentDate.getMonth() !== now.getMonth();
      }));
    },
    content: 'Pour obtenir une facture automatique la plus complète possible, nous vous invitons à remplir des informations complémentaires sur vous.',
  },
  {
    placement: 'top-start',
    target: '#billing-generation',
    shouldSkip: user => {
      if (!user.convention || !user.convention.isConventionSigned) {
        return Promise.resolve(true);
      }
      const now = new Date();
      return agent.Appointment.get().then(appointments => appointments.every(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate.getFullYear() !== now.getFullYear()
          || appointmentDate.getMonth() !== now.getMonth();
      }));
    },
    content: 'Vous pouvez maintenant générer automatiquement une facture pré-remplie pour le mois séléctionné.',
  },
  {
    placement: 'top-start',
    target: '#billing-month',
    content: "Vous pouvez accéder à vos factures précédentes via ce button. Attention, une fois votre facture envoyée à l'université, elle n'est plus modifiable.",
  },
  {
    placement: 'top-start',
    target: '#student-billing-info',
    content: 'Pour préserver le secret médical, ne faites apparaître aucune information personnelle de vos étudiants sur la facture.',
  },
  {
    placement: 'top-start',
    target: '#tva-billing-info',
    content: "Si vous n'êtes pas assujetti à la TVA, veuillez faire apparaître explicitement ce message sur votre facture.",
  },
  {
    placement: 'top-start',
    target: '#faq-button',
    content: "Et en cas de doute, plus d'informations sont disponibles sur la FAQ",
  },
];

export default steps;
