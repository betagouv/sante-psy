import React from 'react';
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
  { key: 'footer-body-link-1', title: 'Contactez-nous', link: '/mentions-legales', external: false },
  { key: 'footer-body-link-2', title: 'etudiant.gouv.fr', link: 'https://www.etudiant.gouv.fr/', external: true },
  { key: 'footer-body-link-3', title: 'Enseignement supérieur', link: 'https://www.enseignementsup-recherche.gouv.fr/', external: true },
  { key: 'footer-body-link-4', title: 'beta.gouv.fr', link: 'https://beta.gouv.fr/', external: true },
];

const footerBottomLinks = [
  { key: 'footer-bottom-link-1', title: 'Accessibilité: non conforme', link: '/mentions-legales#accessibilite' },
  {
    key: 'footer-bottom-link-2',
    title: 'Données personnelles et gestion des cookies',
    link: '/donnees-personnelles-et-gestion-des-cookies',
  },
  { key: 'footer-bottom-link-3', title: 'Mentions légales', link: '/mentions-legales' },
  { key: 'footer-bottom-link-4', title: 'En savoir plus', link: '/faq' },
  { key: 'footer-bottom-link-5', title: 'Nos statistiques', link: '/stats' },
];

const FooterDescription = () => (
  <>
    Le code source est ouvert et les contributions sont bienvenues.
    {' '}
    <Link
      title="Voir le code source"
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
        Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Innovation
      </Logo>
      { footerBodyLinks.map(item => (
        <FooterBodyItem key={item.key}>
          <Link
            href={item.link}
            target={item.external ? '_blank' : '_self'}
            rel={item.external ? 'noopener noreferrer' : 'none'}
          >
            {item.title}
          </Link>
        </FooterBodyItem>
      ))}
    </FooterBody>
    <FooterBottom>
      { footerBottomLinks.map(item => (
        <FooterLink key={item.key} href={item.link}>
          {item.title}
        </FooterLink>
      ))}
    </FooterBottom>
  </DSFooter>
);

export default Footer;
