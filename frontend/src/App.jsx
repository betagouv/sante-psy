import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import Header from 'components/Header/Header';
import Skiplinks from 'components/Header/Skiplinks';
import Matomo from 'components/Matomo/Matomo';
import Landing from 'components/Landing/Landing';
import Footer from 'components/Footer/Footer';

import Login from 'components/Login/Login';
import Faq from 'components/Faq/Faq';
import LegalNotice from 'components/LegalNotice/LegalNotice';
import PersonalData from 'components/PersonalData/PersonalData';
import Statistics from 'components/Statistics/Statistics';
import PsyListing from 'components/PsyListing/PsyListing';
import PublicPsychologistProfile from 'components/PsyListing/PublicPsychologistProfile';

import agent from 'services/agent';

import { useStore } from 'stores/';

// Need to be after dsfr to overwrite it
import './App.css';

const PsychologistRouter = React.lazy(() => import('./PsychologistRouter'));

function App() {
  const { commonStore: { setConfig, config }, userStore: { user, pullUser } } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Config.get().then(response => setConfig(response.data));
    pullUser().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = config.appName ? config.appName : __APPNAME__;
  }, [config]);

  return (
    <>
      {__MATOMO__ && <Matomo />}
      <Skiplinks />
      <Header />
      <ScrollToTop />
      <div id="contenu">
        {!loading && (
        <React.Suspense fallback={<></>}>
          <Switch>
            <Route exact path="/psychologue/login/:token?" component={Login} />
            {user && <Route path="/psychologue/" component={PsychologistRouter} />}
            <Route exact path="/psy/:psyId" component={PublicPsychologistProfile} />
            <Route exact path="/trouver-un-psychologue" component={PsyListing} />
            <Route exact path="/mentions-legales" component={LegalNotice} />
            <Route exact path="/donnees-personnelles-et-gestion-des-cookies" component={PersonalData} />
            <Route exact path="/faq" component={Faq} />
            <Route exact path="/stats" component={Statistics} />
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
