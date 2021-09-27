import appointmentsSteps from './appointments';
import globalSteps from './global';

const getSteps = id => {
  switch (id) {
    case 'appointments':
      return appointmentsSteps;
    default:
      return globalSteps;
  }
};

export default getSteps;
