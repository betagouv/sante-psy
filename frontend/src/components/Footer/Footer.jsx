import React from 'react';
import { Footer as DSFooter, FooterBody, FooterBottom, FooterLink, Logo } from '@dataesr/react-dsfr';

const Footer = () => (
  <DSFooter>
    <FooterBody
      description="Le code source est ouvert et les contributions sont bienvenues. Voir le code source"
    >
      {/* TODO : "Voir le code source" should be a link */}
      {/* <a
      title="Voir le code source"
      href="https://github.com/betagouv/sante-psy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Voir le code source
    </a> */}
      <Logo href="https://www.enseignementsup-recherche.gouv.fr/">
        Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Innovation
      </Logo>
    </FooterBody>
    <FooterBottom>
      <FooterLink href="/mentions-legales#accessibilite">
        Accessibilité: non conforme
      </FooterLink>
      <FooterLink href="/donnees-personnelles-et-gestion-des-cookies">
        Données personnelles et gestion des cookies
      </FooterLink>
      <FooterLink href="/mentions-legales">
        Mentions légales
      </FooterLink>
      <FooterLink href="/faq">
        En savoir plus
      </FooterLink>
      <FooterLink href="/stats">
        Nos statistiques
      </FooterLink>
    </FooterBottom>
  </DSFooter>
);

export default Footer;
