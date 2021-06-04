import axios from 'axios/index';
import Qs from 'qs';
import { store } from 'stores/';

const client = axios.create({
  baseURL: `${__API__}/api`,
  paramsSerializer(params) {
    return Qs.stringify(params, { arrayFormat: 'repeat' });
  },
});

client.interceptors.request.use(config => {
  const { token } = store.userStore;
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }
  return config;
});

client.interceptors.response.use(
  response => {
    if (!response.data.success) {
      store.commonStore.setNotification(response.data);
      throw new Error('Request fail');
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

const Config = { get: () => client.get('/config') };

const Patient = {
  create: patient => client.post('/patients/', patient),
  delete: id => client.delete(`/patients/${id}`),
  get: () => client.get('/patients'),
  getOne: id => client.get(`/patients/${id}`),
  update: (id, patient) => client.put(`/patients/${id}`, patient),
};
const Psychologist = {
  find: () => client.get('/trouver-un-psychologue'),
  getProfile: () => client.get(`/psychologue/${store.userStore.decodedToken.psychologist}`),
  updateProfile: psychologist => client
    .put(`/psychologue/${store.userStore.decodedToken.psychologist}`, psychologist),
};


const Reimbursement = {
  get: () => client.get('/psychologue/mes-remboursements'),
  saveConvention: convention => client.post('/psychologue/renseigner-convention', convention),
};

const User = {
  getConnected: () => client.get('/connecteduser'),
  login: token => client.post('/psychologue/login', { token }),
  sendMail: email => client.post('/psychologue/sendMail', { email }),
};

export default {
  Appointment,
  Config,
  Patient,
  Psychologist,
  Reimbursement,
  User,
};
