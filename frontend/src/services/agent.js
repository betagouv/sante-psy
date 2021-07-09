import axios from 'axios/index';
import Qs from 'qs';
import { store } from 'stores/';

const createClient = () => {
  const simpleClient = axios.create({
    baseURL: `${__API__}/api`,
    paramsSerializer(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
    withCredentials: true,
  });

  simpleClient.interceptors.request.use(request => {
    request.headers['xsrf-token'] = store.userStore.xsrfToken;
    return request;
  });

  return simpleClient;
};

const client = createClient();
const clientWithoutErrorManagement = createClient();

client.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      store.commonStore.setNotification(error.response.data, false);
    }
    throw error;
  },
);

clientWithoutErrorManagement.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status !== 500) {
      store.commonStore.setNotification(error.response.data, false);
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

const Convention = {
  save: convention => client
    .post(`/psychologist/${store.userStore.user.dossierNumber}/convention`, convention),
};

const Map = { findAddress: address => axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`) };

const Patient = {
  create: patient => client.post('/patients/', patient),
  delete: id => client.delete(`/patients/${id}`),
  get: () => client.get('/patients'),
  getOne: id => client.get(`/patients/${id}`),
  update: (id, patient) => client.put(`/patients/${id}`, patient),
};

const Psychologist = {
  activate: () => client.post(`/psychologist/${store.userStore.user.dossierNumber}/activate`),
  find: () => client.get('/trouver-un-psychologue'),
  getProfile: id => client.get(`/psychologist/${id || store.userStore.user.dossierNumber}`),
  suspend: (reason, date) => client
    .post(`/psychologist/${store.userStore.user.dossierNumber}/suspend`, { reason, date }),
  updateProfile: psychologist => client
    .put(`/psychologist/${store.userStore.user.dossierNumber}`, psychologist),
};

const Statistics = { getAll: () => client.get('/statistics') };

const University = { getAll: () => client.get('/university') };

const User = {
  getConnected: () => clientWithoutErrorManagement.get('/connecteduser'),
  login: token => client.post('/psychologist/login', { token }),
  sendMail: email => client.post('/psychologist/sendMail', { email }),
  logout: () => client.post('/psychologist/logout'),
};

export default {
  Appointment,
  Config,
  Convention,
  Map,
  Patient,
  Psychologist,
  Statistics,
  University,
  User,
};
