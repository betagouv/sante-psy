import axios from 'axios';
import config from '../utils/config';
import CustomError from '../utils/CustomError';

//const INSTAGRAM_API_URL = `https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=${config.instagramToken}`;

const INSTAGRAM_API_URL = 'https://graph.instagram.com';

// const getInstagramPosts = async (ine: string): Promise<boolean> => {
//   // let isStudentEligible = false;
//   // const requestConfig = {
//   //   headers: {
//   //     'X-api-key': config.apiIneToken,
//   //   },
//   //   params: {
//   //     ine,
//   //   },
//   // };

//   // const url = encodeURI(config.apiIneUrl);

//   const response = await axios.get(INSTAGRAM_API_URL)
//         .catch(() => {
//           throw new CustomError(
//             'Une erreur s\'est produite lors de la vérification de l\'éligibilité',
//           );
//         });

//   return Promise.resolve(response.data);
// };

const fetchInstagramPostsByIds = async (ids) => {
  try {
    const requests = ids.map((id) => axios.get(`${INSTAGRAM_API_URL}/${id}`, {
      params: {
        fields: 'id,caption,media_url,media_type,timestamp',
        access_token: config.instagramToken,
      },
    }));

    const responses = await Promise.all(requests);
    return responses.map((response) => response.data);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw new Error('Error fetching Instagram posts');
  }
};

export default fetchInstagramPostsByIds;
