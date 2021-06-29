import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderNav, NavItem } from '@dataesr/react-dsfr';

const defaultItems = [
  { title: 'Comment ça se passe ?', link: '/' },
  { title: 'Nos partenaires', link: '/trouver-un-psychologue' },
  { title: 'Foire aux questions', link: '/faq' },
  // { title: 'Nous contacter', link: '/mentions-legales' },
];

const connectedItems = [
  { title: 'Déclarer mes séances', link: '/psychologue/mes-seances' },
  { title: 'Gérer mes patients', link: '/psychologue/mes-patients' },
  { title: 'Remboursement de mes séances', link: '/psychologue/mes-remboursements' },
  { title: 'Mes informations', link: '/psychologue/mon-profil' },
];

const Nav = ({ path, connected }) => (
  <HeaderNav>
    {connected
      ? connectedItems.map(item => (
        <NavItem
          current={path === item.link}
          title={item.title}
          asLink={<Link to={item.link} />}
        />
      )) : (
        defaultItems.map(item => (
          <NavItem
            current={path === item.link}
            title={item.title}
            asLink={<Link to={item.link} />}
          />
        )))}
  </HeaderNav>
);
export default Nav;
