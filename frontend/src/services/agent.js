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

const Config = { get: () => client.get('/config').then(responseData) };
const Psychologist = {
  find: () => client.get('/trouver-un-psychologue').then(responseData),
  login: token => client.post('/psychologue/login', { token }).then(responseData),
  sendMail: email => client.post('/psychologue/sendMail', { email }).then(responseData),
};

export default {
  Config,
  Psychologist,
};
