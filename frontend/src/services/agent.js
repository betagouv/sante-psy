import axios from 'axios/index';
import Qs from 'qs';

const responseData = res => res.data;

const client = axios.create({
  baseURL: __API__,
  paramsSerializer(params) {
    return Qs.stringify(params, { arrayFormat: 'repeat' });
  },
});

// Manage Login
// client.interceptors.request.use(config => {
//  return config;
// });

const Psychologist = { find: () => client.get('/trouver-un-psychologue').then(responseData) };

export default { Psychologist };
