import React, { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import Header from 'components/Header/Header';
import Landing from 'components/Landing/Landing';
import Footer from 'components/Footer/Footer';
import FindPsychologist from 'components/PsyListing/PsyListing';
import Login from 'components/Login/Login';
import Appointments from 'components/Psychologist/Appointments/Appointments';
import NewAppointment from 'components/Psychologist/Appointments/NewAppointment';
import Reimbursement from 'components/Psychologist/Reimbursement/Reimbursement';
import Patients from 'components/Psychologist/Patients/Patients';
import AddEditPatient from 'components/Psychologist/Patients/AddEditPatient';
import PsyProfile from 'components/Psychologist/Profile/PsyProfile';
import Announcement from 'components/Notification/Announcement';
import Faq from 'components/Faq/Faq';
import LegalNotice from 'components/LegalNotice/LegalNotice';
import PersonalData from 'components/PersonalData/PersonalData';
import Statistics from 'components/Statistics/Statistics';

import agent from 'services/agent';

import { useStore } from 'stores/';

import '@gouvfr/dsfr/dist/css/dsfr.css';

// Need to be after dsfr to overwrite it
import './App.css';

function App() {
  const { commonStore: { setConfig, config }, userStore: { user, pullUser } } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Config.get().then(response => setConfig(response.data));
  }, []);

  useEffect(() => {
    pullUser().then(() => setLoading(false));
  });

  useEffect(() => {
    document.title = config.appName ? config.appName : __APPNAME__;
  }, [config]);

  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      {user && <Announcement />}
      {!loading && (
        <Switch>
          {user && [
            <Route key="appointments" exact path="/psychologue/mes-seances" component={Appointments} />,
            <Route key="new-appointments" exact path="/psychologue/nouvelle-seance" component={NewAppointment} />,
            <Route key="patients" exact path="/psychologue/mes-patients" component={Patients} />,
            <Route key="new-patient" exact path="/psychologue/nouveau-patient" component={AddEditPatient} />,
            <Route key="edit-patient" exact path="/psychologue/modifier-patient/:patientId" component={AddEditPatient} />,
            <Route key="reimbursment" exact path="/psychologue/mes-remboursements" component={Reimbursement} />,
            <Route key="psy-profil" path="/psychologue/mon-profil" component={PsyProfile} />,
          ]}
          <Route exact path="/psychologue/login/:token?" component={Login} />
          <Route exact path="/trouver-un-psychologue" component={FindPsychologist} />
          <Route exact path="/mentions-legales" component={LegalNotice} />
          <Route exact path="/donnees-personnelles-et-gestion-des-cookies" component={PersonalData} />
          <Route exact path="/faq" component={Faq} />
          <Route exact path="/stats" component={Statistics} />
          <Route exact path="/" component={Landing} />
          <Route path="/psychologue/">
            <Redirect to={user ? '/psychologue/mes-seances' : '/psychologue/login'} />
          </Route>
          <Route path="/">
            <Redirect to={user ? '/psychologue/mes-seances' : '/'} />
          </Route>
        </Switch>
      )}
      <Footer />
    </BrowserRouter>
  );
}

export default observer(App);
