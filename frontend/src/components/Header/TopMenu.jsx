import React from 'react';
import { Link } from 'react-router-dom';

import { useStore } from 'stores/';

const TopMenu = ({ buttonStyle, close }) => {
  const { userStore: { deleteToken } } = useStore();
  return (
    <ul className="fr-links-group">
      <li>
        {buttonStyle ? (
          <>
            <button
              data-test-id="logout-button"
              type="button"
              className="fr-link"
              onClick={deleteToken}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="fr-link"
              onClick={() => { deleteToken(); close(); }}
            >
              Déconnexion
            </Link>
          </>
        ) }
      </li>
    </ul>
  );
};

export default TopMenu;
