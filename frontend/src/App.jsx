import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import Header from 'components/Header/Header';
import Skiplinks from 'components/Header/Skiplinks';
import Matomo from 'components/Matomo/Matomo';
import Landing from 'components/Landing/Landing';
import Footer from 'components/Footer/Footer';

import Logout from 'components/Login/Logout';
import Login from 'components/Login/Login';
import Faq from 'components/Faq/Faq';
import CGU from 'components/CGU/CGU';
import LegalNotice from 'components/LegalNotice/LegalNotice';
import PersonalData from 'components/PersonalData/PersonalData';
import Statistics from 'components/Statistics/Statistics';
import PsyListing from 'components/PsyListing/PsyListing';
import PublicPsychologistProfile from 'components/PsyListing/PublicPsychologistProfile';
import Contact from 'components/Contact/Contact';

import agent from 'services/agent';

import { useStore } from 'stores/';

import './colors.css';
import './App.css';
import InactiveProfile from 'components/Psychologist/Profile/InactiveProfile';
import ActiveProfile from 'components/Psychologist/Profile/ActiveProfile';

const PsychologistRouter = React.lazy(() => import('./PsychologistRouter'));

function App() {
  const { commonStore: { setConfig }, userStore: { user, pullUser } } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Config.get().then(response => setConfig(response.data));
    pullUser().finally(() => setLoading(false));
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <>
      {__MATOMO__ && <Matomo />}
      <Skiplinks />
      <Header />
      <ScrollToTop loading={loading} />
      <div id="contenu">
        {!loading && (
        <React.Suspense fallback={<></>}>
          <Switch>
            <Route exact path="/activation/:token" component={ActiveProfile} />
            <Route exact path="/suspension/:token" component={InactiveProfile} />
            <Route exact path="/psychologue/logout" component={Logout} />
            <Route exact path="/psychologue/login/:token?" component={Login} />
            {user && <Route path="/psychologue/" component={PsychologistRouter} />}
            <Route exact path="/trouver-un-psychologue" component={PsyListing} />
            <Route exact path="/trouver-un-psychologue/:psyId" component={PublicPsychologistProfile} />
            <Route exact path="/mentions-legales" component={LegalNotice} />
            <Route exact path="/donnees-personnelles-et-gestion-des-cookies" component={PersonalData} />
            <Route exact path="/cgu" component={CGU} />
            <Route exact path="/faq" component={Faq} />
            <Route exact path="/stats" component={Statistics} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/" component={Landing} />
            <Route path="/psychologue/">
              <Redirect to="/psychologue/login" />
            </Route>
            <Route path="/">
              <Redirect to={user ? '/psychologue/mes-seances' : '/'} />
            </Route>
          </Switch>
        </React.Suspense>
        )}
      </div>
      <Footer />
    </>
  );
}

export default observer(App);
