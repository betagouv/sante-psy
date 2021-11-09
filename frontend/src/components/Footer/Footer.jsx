import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import {
  Footer as DSFooter,
  FooterBody,
  FooterBodyItem,
  FooterBottom,
  FooterLink,
  Logo,
  Link,
  SwitchTheme,
} from '@dataesr/react-dsfr';

const footerBodyLinks = [
  { key: 'footer-body-link-1', title: 'Contactez-nous', link: '/contact', external: false },
  { key: 'footer-body-link-2', title: 'etudiant.gouv.fr', link: 'https://www.etudiant.gouv.fr/', external: true },
  { key: 'footer-body-link-3', title: 'Enseignement supérieur', link: 'https://www.enseignementsup-recherche.gouv.fr/', external: true },
  { key: 'footer-body-link-4', title: 'beta.gouv.fr', link: 'https://beta.gouv.fr/', external: true },
];

const footerBottomLinks = [
  {
    key: 'footer-bottom-link-accessibility',
    title: 'Accessibilité : non conforme',
    link: '/mentions-legales#accessibilite',
  },
  {
    key: 'footer-bottom-link-cookies',
    title: 'Données personnelles et gestion des cookies',
    link: '/donnees-personnelles-et-gestion-des-cookies',
  },
  { key: 'footer-bottom-link-legal', title: 'Mentions légales', link: '/mentions-legales' },
  { key: 'footer-bottom-link-cgu', title: "Conditions générales d'utilisation", link: '/cgu' },
  { key: 'footer-bottom-link-privacy', title: "Politique de confidentialité", link: '/politique-de-confidentialite' },
  { key: 'footer-bottom-link-stats', title: 'Nos statistiques', link: '/stats' },
];

const FooterDescription = () => (
  <>
    Le code source est ouvert et les contributions sont bienvenues.
    {' '}
    <Link
      href="https://github.com/betagouv/sante-psy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Voir le code source
    </Link>
    .
  </>
);

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DSFooter>
        <FooterBody description={<FooterDescription />}>
          <Logo href="https://www.enseignementsup-recherche.gouv.fr/">
            Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Innovation
          </Logo>
          { footerBodyLinks.map(item => (
            <FooterBodyItem key={item.key}>
              {item.external ? (
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.alt}
                >
                  {item.title}
                </Link>
              ) : (
                <HashLink title={item.alt} to={item.link}>
                  {item.title}
                </HashLink>
              )}
            </FooterBodyItem>
          ))}
        </FooterBody>
        <FooterBottom>
          { [(
            <FooterLink
              key="theme"
              onClick={() => setIsOpen(true)}
            >
              <span
                className="fr-fi-theme-fill fr-link--icon-left"
                aria-controls="fr-theme-modal"
                data-fr-opened={isOpen}
              >
                Paramètres d’affichage
              </span>
            </FooterLink>
          )].concat(footerBottomLinks.map(item => (
            <FooterLink
              key={item.key}
              href={item.external ? item.link : undefined}
              asLink={item.external ? undefined : <HashLink to={item.link} />}
            >
              {item.title}
            </FooterLink>
          )))}
        </FooterBottom>
      </DSFooter>
      <SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Footer;
