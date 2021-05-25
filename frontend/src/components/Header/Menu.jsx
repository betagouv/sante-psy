import React from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import Logout from './Logout';

const Menu = ({ page, open, close }) => (
  <div
    className={classnames('fr-header__menu', 'fr-modal', { 'fr-modal--opened': open })}
    id="modal-menu"
  >
    <div className="fr-container">
      <button
        type="button"
        className="fr-link--close fr-link"
        aria-controls="modal-menu"
        onClick={close}
      >
        Fermer
      </button>
      <div className="fr-header__menu-links">
        <nav id="header-navigation" className="fr-nav" role="navigation" aria-label="Menu principal">
          <ul className="fr-nav__list">
            <li className="fr-nav__item">
              <NavLink
                className="fr-nav__link menu-link"
                to="/psychologue/mes-seances"
                target="_self"
                aria-current={page === '/psychologue/mes-seances' ? 'true' : 'page'}
                onClick={close}
              >
                Déclarer mes séances
              </NavLink>
            </li>
            <li className="fr-nav__item">
              <NavLink
                className="fr-nav__link menu-link"
                to="/psychologue/mes-patients"
                target="_self"
                aria-current={page === '/psychologue/mes-patients' ? 'true' : 'page'}
                onClick={close}
              >
                Gérer mes patients
              </NavLink>
            </li>
            <li className="fr-nav__item">
              <NavLink
                className="fr-nav__link menu-link"
                to="/psychologue/mes-remboursements"
                target="_self"
                aria-current={page === '/psychologue/mes-remboursements' ? 'true' : 'page'}
                onClick={close}
              >
                Remboursement de mes séances
              </NavLink>
            </li>
          </ul>
        </nav>
        {open && <Logout close={close} />}
      </div>
    </div>
  </div>
);
export default Menu;
