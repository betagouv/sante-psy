import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'stores/';

const Logout = ({ buttonStyle, close }) => {
  const { userStore: { setToken } } = useStore();
  return (
    <ul className="fr-links-group">
      <li>
        {buttonStyle ? (
          <button
            type="button"
            className="fr-link"
            onClick={() => setToken(null)}
          >
            Déconnexion
          </button>
        )
          : (
            <Link
              to="/"
              className="fr-link"
              onClick={() => { setToken(null); close(); }}
            >
              Déconnexion
            </Link>
          ) }
      </li>
    </ul>
  );
};

export default Logout;
