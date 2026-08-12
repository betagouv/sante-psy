import axios, { AxiosError } from 'axios';
import date from '../utils/date';

const API_INES_TIMEOUT_MS = parseInt(process.env.API_INES_TIMEOUT_MS) || 5000;

export type INEApiResult =
  | { status: 'found' }
  | { status: 'not_found' }
  | { status: 'technical_error'; error: Error };

const getAccessToken = async (): Promise<string> => {
  const tokenURL = process.env.INES_TOKEN_URL;
  const username = process.env.INES_USERNAME;
  const password = process.env.INES_PASSWORD;

  if (!username || !password || !tokenURL) {
    throw new Error(
      "INES_USERNAME ou INES_PASSWORD ou TOKEN_URL manquant dans les variables d'environnement",
    );
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
    throw new Error(
      `Erreur lors de la récupération du token: ${axiosError.message}`,
    );
  }
};

const checkApiInesTrue = async (payload: {
  ine: string;
  dateNaissance: string;
}): Promise<INEApiResult> => {
  const verificationURL = process.env.INES_VERIFICATION_URL;
  const xChannel = process.env.INES_XCHANNEL;

  if (!verificationURL || !xChannel) {
    throw new Error(
      "VERIFICATION_URL ou XCHANNEL manquant dans les variables d'environnement",
    );
  }

  try {
    const token = await getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-channel': xChannel,
      'x-jwt-assertion': token,
    };
    await axios.post(verificationURL, payload, {
      headers,
      timeout: API_INES_TIMEOUT_MS,
    });
    return {
      status: 'found',
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 404) {
      return { status: 'not_found' };
    }

    if (axiosError.code === 'ECONNABORTED') {
      return {
        status: 'technical_error',
        error: new Error(
          `Timeout: l'API INES n'a pas répondu dans le délai imparti`,
        ),
      };
    }

    return {
      status: 'technical_error',
      error: new Error(
        `Erreur lors de la vérification de l'API INES: ${axiosError.message} (status: ${axiosError.response?.status})`,
      ),
    };
  }
};

const verifyINE = async (
  INE: string,
  dateOfBirth: Date,
): Promise<INEApiResult> => {
  const verificationPayload = {
    ine: INE,
    dateNaissance: date.dateToDashedString(dateOfBirth),
  };
  return checkApiInesTrue(verificationPayload);
};

export default verifyINE;
