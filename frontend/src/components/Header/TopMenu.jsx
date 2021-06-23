import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';

const TopMenu = ({ buttonStyle, close }) => {
  const { userStore: { setToken } } = useStore();
  return (
    <ul className="fr-links-group">
      <li>
        {buttonStyle ? (
          <>
            <button
              data-test-id="logout-button"
              type="button"
              className="fr-link"
              onClick={() => setToken(null)}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="fr-link"
              onClick={() => { setToken(null); close(); }}
            >
              Déconnexion
            </Link>
          </>
        ) }
      </li>
    </ul>
  );
};

export default observer(TopMenu);
