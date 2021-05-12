import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import Header from 'components/Header/Header';
import Landing from 'components/Landing/Landing';
import Footer from 'components/Footer/Footer';
import FindPsychologist from 'components/PsyListing/PsyListing';
import Login from 'components/Login/Login';
import Appointments from 'components/Psychologist/Appointments';

import agent from 'services/agent';

import { useStore } from 'stores/';

import './App.css';
import '@gouvfr/dsfr/dist/css/dsfr.css';

function App() {
  const { commonStore: { setConfig, config }, userStore: { isAuthenticated } } = useStore();

  useEffect(() => {
    agent.Config.get().then(setConfig);
  }, []);

  useEffect(() => {
    document.title = config.appName ? config.appName : __APPNAME__;
  }, [config]);

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        {isAuthenticated() && [
          <Route key="appointments" exact path="/psychologue/mes-seances" component={Appointments} />,
        ]}
        <Route exact path="/psychologue/login/:token?" component={Login} />
        <Route exact path="/trouver-un-psychologue" component={FindPsychologist} />
        <Route path="/" component={Landing} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default observer(App);
