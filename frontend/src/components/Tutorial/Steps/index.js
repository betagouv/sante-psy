import appointmentsSteps from './appointments';
import newAppointmentSteps from './newAppointment';
import studentsSteps from './students';
import dashboardSteps from './dashboard';
import billingSteps from './billing';
import billingInfoSteps from './billingInfo';
import globalSteps from './global';

const getSteps = id => {
  switch (id) {
    case 'appointments':
      return appointmentsSteps;
    case 'new-appointment':
      return newAppointmentSteps;
    case 'students':
      return studentsSteps;
    case 'dashboard':
      return dashboardSteps;
    case 'billing':
      return billingSteps;
    case 'billing-info':
      return billingInfoSteps;
    default:
      return globalSteps;
  }
};

export default getSteps;
