import React from 'react';
import { HashLink } from 'react-router-hash-link';

import Logo from 'components/Logo/LogoFooter';
import FooterBottomItem from './FooterBottomItem';

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
            {' '}
            <a
              title="Voir le code source"
              href="https://github.com/betagouv/sante-psy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir le code source
            </a>
          </p>
          <ul className="fr-footer__content-list">
            <li className="fr-footer__content-item">
              <HashLink
                className="fr-footer__content-link"
                title="Contactez-nous"
                to="/mentions-legales"
              >
                Contactez-nous
              </HashLink>
            </li>
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://www.etudiant.gouv.fr/"
                target="_blank"
                rel="noreferrer"
              >
                etudiant.gouv.fr
              </a>
            </li>
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://www.enseignementsup-recherche.gouv.fr"
                target="_blank"
                rel="noreferrer"
              >
                Enseignement supérieur
              </a>
            </li>
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://beta.gouv.fr/"
                target="_blank"
                rel="noreferrer"
              >
                beta.gouv.fr
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="fr-footer__bottom">
        <ul className="fr-footer__bottom-list">
          <FooterBottomItem
            to="/mentions-legales#accessibilite"
            label="Accessibilité: non conforme"
          />
          <FooterBottomItem
            to="/donnees-personnelles-et-gestion-des-cookies"
            label="Données personnelles et gestion des cookies"
          />
          <FooterBottomItem
            to="/mentions-legales"
            label="Mentions légales"
          />
          <FooterBottomItem
            to="/faq"
            label="En savoir plus"
          />
          <FooterBottomItem
            to="/stats"
            label="Nos statistiques"
          />
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
