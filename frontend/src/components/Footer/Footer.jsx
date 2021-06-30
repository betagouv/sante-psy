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
  { title: 'Contactez-nous', link: '/mentions-legales' },
  { title: 'etudiant.gouv.fr', link: 'https://www.etudiant.gouv.fr/' },
  { title: 'Enseignement supérieur', link: 'https://www.enseignementsup-recherche.gouv.fr/' },
  { title: 'beta.gouv.fr', link: 'https://beta.gouv.fr/' },
];

const footerBottomLinks = [
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
        <FooterBodyItem key={footerBodyLinks.indexOf(item)}>
          <Link
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.title}
          </Link>
        </FooterBodyItem>
      ))}
    </FooterBody>
    <FooterBottom>
      { footerBottomLinks.map(item => (
        <FooterLink key={footerBottomLinks.indexOf(item)} href={item.link}>
          {item.title}
        </FooterLink>
      ))}
    </FooterBottom>
  </DSFooter>
);

export default Footer;
