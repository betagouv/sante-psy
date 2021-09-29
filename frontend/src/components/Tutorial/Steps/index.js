import appointmentsSteps from './appointments';
import newAppointmentSteps from './newAppointment';
import studentsSteps from './students';
import newStudentsSteps from './newStudent';
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
    default:
      return globalSteps;
  }
};

export default getSteps;
