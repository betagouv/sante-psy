import React from 'react';
import { HashLink } from 'react-router-hash-link';

const FooterBottomItem = ({ to, label }) => (
  <li className="fr-footer__bottom-item">
    <HashLink
      className="fr-footer__bottom-link"
      to={to}
    >
      {label}
    </HashLink>
  </li>
);

export default FooterBottomItem;
