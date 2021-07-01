import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Header as DSHeader,
  HeaderBody,
  HeaderNav,
  NavItem,
  Logo,
  Service,
  Tool,
  ToolItemGroup,
  ToolItem,
  Button,
} from '@dataesr/react-dsfr';
import { useStore } from 'stores/';

const defaultItems = [
  { title: 'Comment ça se passe ?', link: '/' },
  { title: 'Trouver un psychologue', link: '/trouver-un-psychologue' },
  { title: 'Foire aux questions', link: '/faq' },
  // { title: 'Nous contacter', link: '/mentions-legales' },
];

const connectedItems = [
  { title: 'Déclarer mes séances', link: '/psychologue/mes-seances' },
  { title: 'Gérer mes patients', link: '/psychologue/mes-patients' },
  { title: 'Remboursement de mes séances', link: '/psychologue/mes-remboursements' },
  { title: 'Mes informations', link: '/psychologue/mon-profil' },
];

const Header = () => {
  const location = useLocation();
  const { userStore: { user, deleteToken } } = useStore();
  const [path, setPath] = useState(() => location.pathname || '');

  useEffect(() => {
    if (path !== location.pathname) {
      setPath(location.pathname);
    }
  }, [path, setPath, location]);

  const psychologistPage = location.pathname.startsWith('/psychologue');
  return (
    <>
      <DSHeader>
        <HeaderBody>
          <Logo>
            Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Innovation
          </Logo>
          <Service
            title={`${__APPNAME__}${psychologistPage ? ' - Espace Psychologues' : ''}`}
            description="Accompagnement psychologique pour les étudiants"
          />
          <Tool>
            <ToolItemGroup>
              {user ? (
                <ToolItem asLink={<div data-test-id="logout-button" onClick={deleteToken} />}>
                  Déconnexion
                </ToolItem>
              ) : (
                <ToolItem link="/psychologue/login">
                  <Button>Se connecter en tant que psychologue</Button>
                </ToolItem>
              )}
            </ToolItemGroup>
          </Tool>
        </HeaderBody>
        <HeaderNav>
          {psychologistPage && user
            ? connectedItems.map(item => (
              <NavItem
                key={connectedItems.indexOf(item)}
                current={path.startsWith(item.link)}
                title={item.title}
                link={item.link}
              />
            )) : (
              defaultItems.map(item => (
                <NavItem
                  key={defaultItems.indexOf(item)}
                  current={path === item.link}
                  title={item.title}
                  link={item.link}
                />
              )))}
        </HeaderNav>
      </DSHeader>
    </>
  );
};

export default observer(Header);
