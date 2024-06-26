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
          if (error.response && error.response.status) {
            const { status } = error.response;
            if (status !== 404 && status !== 400) {
              throw new CustomError(
                'Une erreur s\'est produite lors de la vérification de l\'éligibilité',
                error.response.status,
              );
            } else if (status === 404) {
              console.log('Check éligibilité: l\'éligibilité de l\'étudiant n\'a pas été trouvée');
            }
          } else {
            throw new CustomError(
              'Une erreur s\'est produite lors de la vérification de l\'éligibilité',
            );
          }
        });

  if (response && response.data) {
    isStudentEligible = (response.data.ine && response.data.ine === ine);
    if (!isStudentEligible && (response.data.inscriptions && response.data.inscriptions.length > 0)) {
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
