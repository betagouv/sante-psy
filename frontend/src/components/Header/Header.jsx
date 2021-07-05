import React from 'react';
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
  { key: 'header-default-link-1', title: 'Comment ça se passe ?', link: '/' },
  { key: 'header-default-link-2', title: 'Trouver un psychologue', link: '/trouver-un-psychologue' },
  { key: 'header-default-link-3', title: 'Foire aux questions', link: '/faq' },
];

const connectedItems = [
  { key: 'header-connected-link-1', title: 'Déclarer mes séances', link: '/psychologue/mes-seances' },
  { key: 'header-connected-link-2', title: 'Gérer mes patients', link: '/psychologue/mes-patients' },
  { key: 'header-connected-link-3', title: 'Remboursement de mes séances', link: '/psychologue/mes-remboursements' },
  { key: 'header-connected-link-4', title: 'Mes informations', link: '/psychologue/mon-profil' },
];

const Header = () => {
  const location = useLocation();
  const { userStore: { user, deleteToken } } = useStore();

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
                  <Button data-test-id="login-button">
                    Se connecter en tant que psychologue
                  </Button>
                </ToolItem>
              )}
            </ToolItemGroup>
          </Tool>
        </HeaderBody>
        <HeaderNav>
          {psychologistPage && user
            ? connectedItems.map(item => (
              <NavItem
                key={item.key}
                data-test-id={item.key}
                current={location.pathname && location.pathname.startsWith(item.link)}
                title={item.title}
                link={item.link}
              />
            )) : (
              defaultItems.map(item => (
                <NavItem
                  key={item.key}
                  data-test-id={item.key}
                  current={location.pathname && location.pathname === item.link}
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
