import React from 'react';
import { HashLink } from 'react-router-hash-link';

const LogoFooter = () => (
  <div className="fr-footer__brand">
    <HashLink className="fr-logo" to="/" title="République française">
      <span className="fr-logo__title">
        Ministère
        <br />
        de l&lsquo;Enseignement
        <br />
        Supérieur,
        <br />
        de la Recherche
        <br />
        et de l&lsquo;Innovation
      </span>
    </HashLink>
  </div>
);

export default LogoFooter;
