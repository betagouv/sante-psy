import axios, { AxiosError } from 'axios';
import CustomError from '../utils/CustomError';
import date from '../utils/date';

const getAccessToken = async (): Promise<string> => {
  const tokenURL = process.env.INES_TOKEN_URL;
  const username = process.env.INES_USERNAME;
  const password = process.env.INES_PASSWORD;

  if (!username || !password || !tokenURL) {
    throw new Error('INES_USERNAME ou INES_PASSWORD ou TOKEN_URL manquant dans les variables d\'environnement');
  }

  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(tokenURL, params, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(`Erreur lors de la récupération du token: ${axiosError.message}`);
  }
};

const checkApiInesTrue = async (payload: { ine: string; dateNaissance: string }): Promise<
{ ine: string; dateNaissance: string }
> => {
  const verificationURL = process.env.INES_VERIFICATION_URL;
  const xChannel = process.env.INES_XCHANNEL;
  const token = await getAccessToken();

  if (!verificationURL || !xChannel) {
    throw new Error('VERIFICATION_URL ou XCHANNEL manquant dans les variables d\'environnement');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-channel': xChannel,
    'x-jwt-assertion': token,
  };

  try {
    const response = await axios.post(verificationURL, payload, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(`Erreur lors de la vérification de l'API INES: ${axiosError.message}`);
  }
};

const verifyINE = async (INE: string, dateOfBirth: Date): Promise<void> => {
  const verificationPayload = {
    ine: INE,
    dateNaissance: date.dateToDashedString(dateOfBirth),
  };

  const verificationResponse = await checkApiInesTrue(verificationPayload);

  if (!verificationResponse) {
    throw new CustomError('INE ou/et date de naissance non trouvé dans API INES', 400);
  }
};

export default verifyINE;
