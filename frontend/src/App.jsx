import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from 'components/Header/Header';
import Landing from 'components/Landing/Landing';
import Footer from 'components/Footer/Footer';
import FindPsychologist from 'components/PsyListing/PsyListing';

import './App.css';
import '@gouvfr/dsfr/dist/css/dsfr.css';

function App() {
  useEffect(() => {
    document.title = __APPNAME__;
  });

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/trouver-un-psychologue" component={FindPsychologist} />
        <Route path="/" component={Landing} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
