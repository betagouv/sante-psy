import appointmentsSteps from './appointments';
import newAppointmentSteps from './newAppointment';
import studentsSteps from './students';
import newStudentsSteps from './newStudent';
import profileSteps from './profile';
import billingSteps from './billing';
import globalSteps from './global';

const getSteps = id => {
  switch (id) {
    case 'appointments':
      return appointmentsSteps;
    case 'new-appointment':
      return newAppointmentSteps;
    case 'students':
      return studentsSteps;
    case 'new-student':
      return newStudentsSteps;
    case 'profile':
      return profileSteps;
    case 'billing':
      return billingSteps;
    default:
      return globalSteps;
  }
};

export default getSteps;
