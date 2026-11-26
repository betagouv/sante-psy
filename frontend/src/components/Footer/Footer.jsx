import React from 'react';
import { Footer as FooterDSFR } from '@codegouvfr/react-dsfr/Footer';

const footerBodyLinks = [
  {
    key: 'footer-body-link-1',
    title: 'Contactez-nous',
    link: '/contact',
    external: false,
  },
  {
    key: 'footer-body-link-2',
    title: 'etudiant.gouv.fr',
    link: 'https://www.etudiant.gouv.fr/',
    external: true,
  },
  {
    key: 'footer-body-link-3',
    title: 'Enseignement supérieur',
    link: 'https://www.enseignementsup-recherche.gouv.fr/',
    external: true,
  },
  {
    key: 'footer-body-link-4',
    title: 'beta.gouv.fr',
    link: 'https://beta.gouv.fr/',
    external: true,
  },
];

const footerBottomLinks = [
  {
    key: 'footer-bottom-link-accessibility',
    title: 'Accessibilité : non conforme',
    link: '/declaration-accessibilite',
  },
  {
    key: 'footer-bottom-link-legal',
    title: 'Mentions légales',
    link: '/mentions-legales',
  },
  {
    key: 'footer-bottom-link-cgu',
    title: "Conditions générales d'utilisation",
    link: '/cgu',
  },
  {
    key: 'footer-bottom-link-privacy',
    title: 'Politique de confidentialité',
    link: '/politique-de-confidentialite',
  },
  { key: 'footer-bottom-link-stats', title: 'Statistiques', link: '/stats' },
];

const Footer = () => (
  <FooterDSFR
    accessibility="non compliant"
    brandTop={
      <>
        Ministère de l'Enseignement
        <br />
        Supérieur, de la Recherche
        <br />
        et de l'Espace
      </>
    }
    homeLinkProps={{
      href: 'https://www.enseignementsup-recherche.gouv.fr/',
      title: 'Accueil',
    }}
    contentDescription={
      <>
        Le code source est ouvert et les contributions sont bienvenues.{' '}
        <a
          href="https://github.com/betagouv/sante-psy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir le code source
        </a>
        .
      </>
    }
    linkList={[
      {
        categoryName: 'Liens utiles',
        links: footerBodyLinks.map((item) => ({
          text: item.title,
          linkProps: item.external
            ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
            : { to: item.link },
        })),
      },
    ]}
    bottomItems={footerBottomLinks.map((item) => ({
      text: item.title,
      linkProps: { to: item.link },
    }))}
  />
);

export default Footer;
