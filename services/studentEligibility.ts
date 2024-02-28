import axios from 'axios';
import config from '../utils/config';
import CustomError from '../utils/CustomError';
import { Inscription } from '../types/Eligibility';

const getStudentEligibility = async (ine: string): Promise<boolean> => {
  let isStudentEligible = false;
  const requestConfig = {
    headers: {
      'X-api-key': config.apiIneToken,
    },
    params: {
      ine,
    },
  };

  const url = encodeURI(config.apiIneUrl);

  const response = await axios.get(url, requestConfig)
        .catch((error) => {
          const { status } = error.response;
          console.log('Error checking student eligibility with API INE : ', error);
          if (status !== 404 && status !== 400) {
            throw new CustomError(
              'Une erreur s\'est produite lors de la vérification de l\'éligibilité',
              error.response.status,
            );
          }
        });

  if (response && response.data) {
    isStudentEligible = (response.data.ine && response.data.ine === ine);
    if (!isStudentEligible) {
      response.data.inscriptions.forEach((inscription: Inscription) => {
        if (inscription.statut === 'inscrit') {
          isStudentEligible = true;
        }
      });
    }
  }

  return Promise.resolve(isStudentEligible);
};

export default getStudentEligibility;
