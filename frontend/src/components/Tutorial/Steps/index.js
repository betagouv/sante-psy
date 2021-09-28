import appointmentsSteps from './appointments';
import studentsSteps from './students';
import globalSteps from './global';

const getSteps = id => {
  switch (id) {
    case 'appointments':
      return appointmentsSteps;
    case 'students':
      return studentsSteps;
    default:
      return globalSteps;
  }
};

export default getSteps;
