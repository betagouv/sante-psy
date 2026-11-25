import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import { configure } from 'mobx';
import { Observer } from 'mobx-react';

import { registerLocale, setDefaultLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';

import Bill from 'components/Psychologist/Reimbursement/Bill';
import App from './App';

import '@codegouvfr/react-dsfr/dsfr/utility/icons/icons.min.css';

import { startReactDsfr } from '@codegouvfr/react-dsfr/spa';
import { setLink } from '@codegouvfr/react-dsfr/link';

setLink({ Link });

configure({ enforceActions: 'never' });
registerLocale('fr', fr);
setDefaultLocale('fr');

startReactDsfr({ defaultColorScheme: 'system' });

const root = createRoot(document.getElementById('root'));

root.render(
  <Observer>
    {() => (
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/psychologue/bill/:month/:year"
              element={<Bill />}
            />
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    )}
  </Observer>,
);
