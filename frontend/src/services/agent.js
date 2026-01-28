import axios from 'axios';
import { parse, stringify } from 'qs';
import { store } from 'stores/';

const createClient = () => {
  const simpleClient = axios.create({
    baseURL: `${__API__}/api`,
    paramsSerializer: {
      encode: parse,
      serialize: stringify,
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
  get: (options = { month: new Date().getMonth() + 1, year: new Date().getFullYear(), isBillingPurposes: false }) => client.get('/appointments', { params: options }),
  getByPatientId: id => client.get(`/appointments/${id}`),
};

const Auth = {
  login: token => client.post('/auth/login', { token }),
  sendLoginMail: email => client.post('/auth/sendLoginMail', { email }),
  getConnected: () => clientWithoutErrorManagement.get('/auth/connected'),
};

const Config = { get: () => clientWithoutErrorManagement.get('/config') };

const Contact = { send: message => client.post('/contact', message) };

const Convention = {
  save: convention => client
    .post(`/psychologist/${store.userStore.user.dossierNumber}/convention`, convention),
};

const Patient = {
  create: patient => client.post('/patients/', patient),
  delete: id => client.delete(`/patients/${id}`),
  get: () => client.get('/patients'),
  getOne: id => client.get(`/patients/${id}`),
  update: (id, patient) => client.put(`/patients/${id}`, patient),
  sendCertificate: formData => client.post('/patients/send-certificate', formData),
};

const Psychologist = {
  activate: () => client.post(`/psychologist/${store.userStore.user.dossierNumber}/activate`),
  find: filters => client.get('/trouver-un-psychologue/reduced', { params: { filters } }),
  getProfile: id => client.get(`/psychologist/${id || store.userStore.user.dossierNumber}`),
  suspend: (reason, date) => client
    .post(`/psychologist/${store.userStore.user.dossierNumber}/suspend`, { reason, date }),
  inactive: (reason, token) => client
    .post(`/psychologist/${token}/inactive`, { reason }),
  active: token => client
    .post(`/psychologist/${token}/active`),
  updateProfile: psychologist => client
    .put(`/psychologist/${store.userStore.user.dossierNumber}`, psychologist),
  seeTutorial: () => client.put(`/psychologist/${store.userStore.user.dossierNumber}/seeTutorial`),
};

const Statistics = { getAll: () => client.get('/statistics') };

const University = { getOne: id => client.get(`/universities/${id}`) };

const Psy = {
  login: token => client.post('/psychologist/login', { token }),
  sendMail: email => client.post('/psychologist/sendMail', { email }),
  logout: () => client.post('/logout'),
};

const Student = {
  signIn: data => client.post('/student/signIn', data),
  sendStudentSecondStepMail: email => client.post('/student/signInSecondStepMail', { email }),
  verifyStudentToken: token => client.post(`/student/signIn/${token}`),
  sendStudentWelcomeMail: email => client.post('/student/sendWelcomeMail', { email }),
  getAppointments: () => client.get(`/student/${store.userStore.user.id}/appointments`),
};

const StudentNewsletter = {
  sendStudentMail: (email, source) => clientWithoutErrorManagement.post('/studentNewsletter/sendStudentMail', { email, source }),
  saveAnswer: data => clientWithoutErrorManagement.post('/studentNewsletter/saveAnswer', data),
  unregister: id => clientWithoutErrorManagement.delete(`/studentNewsletter/${id}`),
};

export default {
  Appointment,
  Auth,
  Config,
  Contact,
  Convention,
  Patient,
  Psychologist,
  Statistics,
  Student,
  StudentNewsletter,
  University,
  Psy,
};
