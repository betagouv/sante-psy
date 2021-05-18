import React from 'react';
import ReactDOM from 'react-dom';

import { configure } from 'mobx';
import { Observer } from 'mobx-react';

import { registerLocale, setDefaultLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';

import './index.css';
import App from './App';

configure({ enforceActions: 'never' });
registerLocale('fr', fr);
setDefaultLocale('fr');

ReactDOM.render(
  <Observer>
    {() => (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )}
  </Observer>,
  document.getElementById('root'),
);
