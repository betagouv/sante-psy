import appointmentsSteps from './appointments';
import newAppointmentSteps from './newAppointment';
import studentsSteps from './students';
import newStudentsSteps from './newStudent';
import dashboardSteps from './dashboard';
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
    case 'dashboard':
      return dashboardSteps;
    case 'billing':
      return billingSteps;
    default:
      return globalSteps;
  }
};

export default getSteps;
