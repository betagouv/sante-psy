import React from 'react';
import { Footer as DSFooter, FooterBody, FooterBottom, FooterLink, Logo } from '@dataesr/react-dsfr';

const footerLinks = [
  { title: 'Accessibilité: non conforme', link: '/mentions-legales#accessibilite' },
  { title: 'Données personnelles et gestion des cookies', link: '/donnees-personnelles-et-gestion-des-cookies' },
  { title: 'Mentions légales', link: '/mentions-legales' },
  { title: 'En savoir plus', link: '/faq' },
  { title: 'Nos statistiques', link: '/stats' },
];

const FooterDescription = () => (
  <>
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
    .
  </>
);

const Footer = () => (
  <DSFooter>
    <FooterBody description={<FooterDescription />}>
      <Logo href="https://www.enseignementsup-recherche.gouv.fr/">
        Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Innovation
      </Logo>
    </FooterBody>
    <FooterBottom>
      { footerLinks.map(item => (
        <FooterLink key={footerLinks.indexOf(item)} href={item.link}>
          {item.title}
        </FooterLink>
      ))}
    </FooterBottom>
  </DSFooter>
);

export default Footer;
