import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
          <Routes>
            <Route exact path="/psychologue/bill/:month/:year" element={<Bill />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    )}
  </Observer>,
  document.getElementById('root'),
);
