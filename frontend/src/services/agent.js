import axios from 'axios/index';
import Qs from 'qs';
import { store } from 'stores/';

const responseData = res => res.data;

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

const Appointment = {
  add: (patientId, date) => client.post('/appointments/', { patientId, date }).then(responseData),
  delete: id => client.delete(`/appointments/${id}`).then(responseData),
  get: () => client.get('/appointments').then(responseData),
};

const Config = { get: () => client.get('/config').then(responseData) };

const Patient = {
  create: patient => client.post('/patients/', patient).then(responseData),
  delete: id => client.delete(`/patients/${id}`).then(responseData),
  get: () => client.get('/patients').then(responseData),
  getOne: id => client.get(`/patients/${id}`).then(responseData),
  update: (id, patient) => client.put(`/patients/${id}`, patient).then(responseData),
};
const Psychologist = {
  find: () => client.get('/trouver-un-psychologue').then(responseData),
  getProfile: () => client.get(`/psychologue/${store.userStore.decodedToken.psychologist}`).then(responseData),
  updateProfile: psychologist => client.put(`/psychologue/${store.userStore.decodedToken.psychologist}`, psychologist).then(responseData),
};

const Reimbursement = {
  get: () => client.get('/psychologue/mes-remboursements').then(responseData),
  saveConvention: convention => client.post('/psychologue/renseigner-convention', convention).then(responseData),
};

const User = {
  getConnected: () => client.get('/connecteduser').then(responseData),
  login: token => client.post('/psychologue/login', { token }).then(responseData),
  sendMail: email => client.post('/psychologue/sendMail', { email }).then(responseData),
};

export default {
  Appointment,
  Config,
  Patient,
  Psychologist,
  Reimbursement,
  User,
};
