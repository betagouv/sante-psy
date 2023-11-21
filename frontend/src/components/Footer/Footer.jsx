import React from 'react';
import { HashLink } from 'react-router-hash-link';
import {
  Footer as DSFooter,
  FooterBody,
  FooterBodyItem,
  FooterBottom,
  FooterLink,
  Logo,
  Link,
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
    link: '/declaration-accessibilite',
  },
  { key: 'footer-bottom-link-legal', title: 'Mentions légales', link: '/mentions-legales' },
  { key: 'footer-bottom-link-cgu', title: "Conditions générales d'utilisation", link: '/cgu' },
  { key: 'footer-bottom-link-privacy', title: 'Politique de confidentialité', link: '/politique-de-confidentialite' },
  { key: 'footer-bottom-link-stats', title: 'Statistiques', link: '/stats' },
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

const Footer = () => (
  <DSFooter>
    <FooterBody description={<FooterDescription />}>
      <Logo href="https://www.enseignementsup-recherche.gouv.fr/">
        Ministère de l&lsquo;Enseignement Supérieur et de la Recherche
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
      { footerBottomLinks.map(item => (
        <FooterLink
          key={item.key}
          href={item.external ? item.link : undefined}
          asLink={item.external ? undefined : <HashLink to={item.link} />}
        >
          {item.title}
        </FooterLink>
      ))}
    </FooterBottom>
  </DSFooter>
);

export default Footer;
