import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { configure } from 'mobx';
import { Observer } from 'mobx-react';

import { registerLocale, setDefaultLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';

import Bill from 'components/Psychologist/Reimbursement/Bill';
import App from './App';

configure({ enforceActions: 'never' });
registerLocale('fr', fr);
setDefaultLocale('fr');

ReactDOM.render(
  <Observer>
    {() => (
      <React.StrictMode>
        <BrowserRouter>
          <Switch>
            <Route exact path="/psychologue/bill/:month/:year" component={Bill} />
            <Route path="/" component={App} />
          </Switch>
        </BrowserRouter>
      </React.StrictMode>
    )}
  </Observer>,
  document.getElementById('root'),
);
