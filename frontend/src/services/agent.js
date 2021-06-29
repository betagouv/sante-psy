import axios from 'axios/index';
import Qs from 'qs';
import { store } from 'stores/';

const createClient = () => {
  const simpleClient = axios.create({
    baseURL: `${__API__}/api`,
    paramsSerializer(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });

  simpleClient.interceptors.request.use(config => {
    const { token } = store.userStore;
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    return config;
  });

  return simpleClient;
};

const client = createClient();
const clientWithoutErrorManagement = createClient();

client.interceptors.response.use(
  response => {
    if (!response.data.success) {
      store.commonStore.setNotification(response.data);
      throw new Error(response.data.message);
    }
    return response.data;
  },
  error => {
    if (error.response) {
      store.commonStore.setNotification(error.response.data);
    }
    throw error;
  },
);

const Appointment = {
  add: (patientId, date) => client.post('/appointments/', { patientId, date }),
  delete: id => client.delete(`/appointments/${id}`),
  get: () => client.get('/appointments'),
};

const Config = { get: () => clientWithoutErrorManagement.get('/config') };

const Patient = {
  create: patient => client.post('/patients/', patient),
  delete: id => client.delete(`/patients/${id}`),
  get: () => client.get('/patients'),
  getOne: id => client.get(`/patients/${id}`),
  update: (id, patient) => client.put(`/patients/${id}`, patient),
};

const Psychologist = {
  activate: () => client.post(`/psychologue/${store.userStore.decodedToken.psychologist}/activate`),
  find: () => client.get('/trouver-un-psychologue'),
  getProfile: () => client.get(`/psychologue/${store.userStore.decodedToken.psychologist}`),
  suspend: (reason, date) => client
    .post(`/psychologue/${store.userStore.decodedToken.psychologist}/suspend`, { reason, date }),
  updateProfile: psychologist => client
    .put(`/psychologue/${store.userStore.decodedToken.psychologist}`, psychologist),
};

const Convention = { save: convention => client.post('/psychologue/renseigner-convention', convention) };

const University = { getAll: () => client.get('/university') };

const User = {
  getConnected: () => clientWithoutErrorManagement.get('/connecteduser'),
  login: token => client.post('/psychologue/login', { token }),
  sendMail: email => client.post('/psychologue/sendMail', { email }),
};

export default {
  Appointment,
  Config,
  Convention,
  Patient,
  Psychologist,
  University,
  User,
};
