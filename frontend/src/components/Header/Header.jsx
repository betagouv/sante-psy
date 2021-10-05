import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
  SwitchTheme,
} from '@dataesr/react-dsfr';

import { useStore } from 'stores/';

const defaultItems = [
  { key: 'header-default-link-1', title: 'Comment ça se passe ?', link: '/' },
  { key: 'header-default-link-2', title: 'Trouver un psychologue', link: '/trouver-un-psychologue' },
  { key: 'header-default-link-3', title: 'Foire aux questions', link: '/faq' },
  { key: 'header-default-link-4', title: 'Nous contacter', link: '/contact' },
];

const connectedItems = [
  { key: 'header-connected-link-1', title: 'Déclarer mes séances', link: '/psychologue/mes-seances' },
  { key: 'header-connected-link-2', title: 'Gérer mes étudiants', link: '/psychologue/mes-etudiants' },
  { key: 'header-connected-link-3', title: 'Gérer mes facturations', link: '/psychologue/mes-remboursements', id: 'billing-header' },
  { key: 'header-connected-link-4', title: 'Mes informations', link: '/psychologue/mon-profil', id: 'informations-header' },
];

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { userStore: { user } } = useStore();

  const psychologistPage = location.pathname.startsWith('/psychologue');
  return (
    <>
      <SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen} />
      <DSHeader>
        <HeaderBody>
          <Logo
            asLink={<Link to="/" />}
          >
            Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Innovation
          </Logo>
          <Service
            asLink={<Link to="/" />}
            title={`${__APPNAME__}${psychologistPage ? ' - Espace Psychologues' : ''}`}
            description="Accompagnement psychologique pour les étudiants"
          />
          <Tool>
            <ToolItemGroup>
              <ToolItem onClick={() => setIsOpen(true)}>
                <span
                  className="fr-fi-theme-fill fr-link--icon-left"
                  aria-controls="fr-theme-modal"
                  data-fr-opened={isOpen}
                >
                  Paramètres d’affichage
                </span>
              </ToolItem>
              { user
                ? (
                  <>
                    { psychologistPage ? (
                      <ToolItem asLink={<Link data-test-id="back-home-button" to="/" />}>
                        Revenir à l&lsquo;accueil
                      </ToolItem>
                    ) : (
                      <ToolItem asLink={<Link data-test-id="my-space-button" to="/psychologue/mes-seances" />}>
                        Accéder à mon espace
                      </ToolItem>
                    )}
                    <ToolItem
                      asLink={(
                        <Link
                          data-test-id="logout-link"
                          to="/psychologue/logout"
                        />
                      )}
                    >
                      Déconnexion
                    </ToolItem>
                  </>
                )
                : (
                  <ToolItem asLink={<Link data-test-id="login-button" to="/psychologue/login" />}>
                    Se connecter en tant que psychologue
                  </ToolItem>
                )}
            </ToolItemGroup>
          </Tool>
        </HeaderBody>
        <HeaderNav>
          {psychologistPage && user
            ? connectedItems.map(item => (
              <NavItem
                id={item.id}
                key={item.key}
                current={location.pathname && location.pathname.startsWith(item.link)}
                title={item.title}
                asLink={(
                  <Link
                    data-test-id={item.key}
                    to={item.link}
                  />
                  )}
              />
            )) : (
              defaultItems.map(item => (
                <NavItem
                  key={item.key}
                  current={location.pathname && location.pathname === item.link}
                  title={item.title}
                  asLink={<Link data-test-id={item.key} to={item.link} />}
                />
              )))}
        </HeaderNav>
      </DSHeader>
    </>
  );
};

export default observer(Header);
