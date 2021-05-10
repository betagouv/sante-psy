import React from 'react';

import Logo from 'components/Logo/Logo';

const Header = () => (
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
                <a
                  href="/"
                  title="Retour à l’accueil"
                >
                  <p className="fr-header__service-title">
                    {`${__APPNAME__} - Espace Psychologues`}
                  </p>
                </a>
                <p className="fr-header__service-tagline">{`${__APPDESCRIPTION__}`}</p>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-links-group" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-header__menu fr-modal" id="modal-menu">
        <div className="fr-container">
          <button
            type="button"
            className="fr-link--close fr-link"
            aria-controls="modal-menu"
          >
            Fermer
          </button>
          <div className="fr-header__menu-links" />
        </div>
      </div>
    </header>
  </>
);

export default Header;
