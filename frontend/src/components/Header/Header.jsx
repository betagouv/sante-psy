import React from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';

import Logo from 'components/Logo/Logo';

import { useStore } from 'stores/';

import Menu from './Menu';

const Header = () => {
  const location = useLocation();
  const { userStore: { isAuthenticated, setToken } } = useStore();

  const psychologistPage = location.pathname.startsWith('/psychologue');
  const loggedIn = isAuthenticated();
  return (
    <>
      <div className="fr-skiplinks">
        <div className="fr-container">
          <ul className="fr-skiplinks__list">
            <li>
              <a className="fr-link" href="#contenu">
                Accéder au contenu
              </a>
            </li>
            <li>
              <a className="fr-link" href="#header-navigation">
                Accéder au menu
              </a>
            </li>
            <li>
              <a className="fr-link" href="#footer">
                Accéder au footer
              </a>
            </li>
          </ul>
        </div>
      </div>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <Logo />
                  <div className="fr-header__navbar">
                    <button
                      type="button"
                      className="fr-btn--menu fr-btn"
                      data-fr-opened="false"
                      aria-controls="modal-menu"
                      aria-haspopup="menu"
                      title="Menu"
                    >
                      Menu
                    </button>
                  </div>
                </div>
                <div className="fr-header__service">
                  <HashLink
                    to="/"
                    title="Retour à l’accueil"
                  >
                    <p className="fr-header__service-title">
                      {`${__APPNAME__}${psychologistPage ? ' - Espace Psychologues' : ''}`}
                    </p>
                  </HashLink>
                  <p className="fr-header__service-tagline">{`${__APPDESCRIPTION__}`}</p>
                </div>
              </div>
              {loggedIn && (
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-links-group">
                    <li>
                      <button
                        type="button"
                        className="fr-link"
                        onClick={() => setToken(null)}
                      >
                        Déconnexion

                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
        {psychologistPage && loggedIn && <Menu page={location.pathname} />}
      </header>
    </>
  );
};

export default observer(Header);
