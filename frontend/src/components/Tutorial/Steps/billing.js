import agent from 'services/agent';
import getBadgeInfos from 'src/utils/badges';

const badges = getBadgeInfos();
const noAppointmentsInPeriod = async () => {
  const now = new Date();
  const appointments = await agent.Appointment.get({ isBillingPurposes: true, month: now.getMonth() + 1, year: now.getFullYear() });
  const haveAppointments = appointments.some(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    return appointmentDate.getFullYear() === now.getFullYear()
        && appointmentDate.getMonth() === now.getMonth();
  });

  const allExceeded = appointments.every(appointment => appointment.badges.includes(badges.exceeded.key));
  return !haveAppointments || allExceeded;
};

const steps = [
  {
    placement: 'center',
    target: 'body',
    title: 'Facturation',
    content: 'Cette page vous permet de gérér vos informations de facturation et de générer vos factures pour les Services de Santé Étudiante.',
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
    shouldSkip: async () => {
      const now = new Date();
      const appointments = await agent.Appointment.get({ isBillingPurposes: true, month: now.getMonth() + 1, year: now.getFullYear() });
      const haveAppointments = appointments.some(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate.getFullYear() === now.getFullYear()
          && appointmentDate.getMonth() === now.getMonth();
      });

      const allExceeded = appointments.every(appointment => appointment.badges.includes(badges.exceeded.key));
      return Promise.resolve(haveAppointments && !allExceeded);
    },
    content: "Vous n'avez pas déclarer de séances pour ce mois-ci, il n'y a donc pas de facture à générer. Commencez par déclarer des séances depuis l'onglet dédié ou générez une facture pour un autre mois.",
  },
  {
    placement: 'top-start',
    target: '#billing-table',
    shouldSkip: () => noAppointmentsInPeriod(),
    content: 'Vous trouverez ici un tableau récapitulatif de vos séances avec les informations à faire apparaître sur votre facture.',
  },
  {
    placement: 'top-start',
    target: '#billing-info',
    shouldSkip: () => noAppointmentsInPeriod(),
    content: 'Pour obtenir une facture automatique la plus complète possible, nous vous invitons à remplir des informations complémentaires sur vous.',
  },
  {
    placement: 'top-start',
    target: '#billing-generation',
    shouldSkip: user => {
      if (!user.convention || !user.convention.isConventionSigned) {
        return Promise.resolve(true);
      }
      return noAppointmentsInPeriod();
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
