import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';

const TopMenu = ({ buttonStyle, close }) => {
  const { userStore: { logout } } = useStore();
  return (
    <ul className="fr-links-group">
      <li>
        {buttonStyle ? (
          <>
            <button
              data-test-id="logout-button"
              type="button"
              className="fr-link"
              onClick={() => logout()}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="fr-link"
              onClick={() => { logout(); close(); }}
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
