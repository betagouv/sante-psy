import React from 'react';
import { Link } from 'react-router-dom';

import Logo from 'components/Logo/Logo';

const Footer = () => (
  <footer className="fr-footer" id="footer">
    <div className="fr-container">
      <div className="fr-footer__body">
        <div className="fr-footer__brand">
          <Logo />
        </div>
        <div className="fr-footer__content">
          <p className="fr-footer__content-desc">
            Le code source est ouvert et les contributions sont bienvenues.
            <a
              title="Voir le code source"
              href={__APPREPO__}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir le code source
            </a>
          </p>
          <ul className="fr-footer__content-list">
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                title="Contactez-nous"
                href="/mentions-legales"
              >
                Contactez-nous
              </a>
            </li>
            <li className="fr-footer__content-item">
              <a className="fr-footer__content-link" href="https://www.etudiant.gouv.fr/">etudiant.gouv.fr</a>
            </li>
            <li className="fr-footer__content-item">
              <a className="fr-footer__content-link" href="https://www.enseignementsup-recherche.gouv.fr">Enseignement supérieur</a>
            </li>
            <li className="fr-footer__content-item">
              <a className="fr-footer__content-link" href="https://beta.gouv.fr/">beta.gouv.fr</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="fr-footer__bottom">
        <ul className="fr-footer__bottom-list">
          <li className="fr-footer__bottom-item">
            <Link
              className="fr-footer__bottom-link"
              to="/mentions-legales#accessibilite"
            >
              Accessibilité: non conforme
            </Link>
          </li>
          <li className="fr-footer__bottom-item">
            <Link
              className="fr-footer__bottom-link"
              to="/donnees-personnelles-et-gestion-des-cookies"
            >
              Données personnelles et gestion des cookies
            </Link>
          </li>
          <li className="fr-footer__bottom-item">
            <Link
              className="fr-footer__bottom-link"
              to="/mentions-legales"
            >
              Mentions légales
            </Link>
          </li>
          <li className="fr-footer__bottom-item">
            <Link
              className="fr-footer__bottom-link"
              to="/faq"
            >
              En savoir plus
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
