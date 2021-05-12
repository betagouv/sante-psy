import React from 'react';
import ReactDOM from 'react-dom';

import { configure } from 'mobx';
import { Observer } from 'mobx-react';

import './index.css';
import App from './App';

configure({ enforceActions: 'never' });

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
