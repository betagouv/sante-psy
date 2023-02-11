import React from 'react';
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
} from '@dataesr/react-dsfr';

import { useStore } from 'stores/';

const defaultItems = [
  { title: 'Comment ça marche ?', link: '/' },
  { title: 'Foire aux questions', link: '/faq' },
  { title: 'Nous contacter', link: '/contact' },
  { title: 'Autres services', link: '/autres-services' },
];

const connectedItems = [
  { title: 'Déclarer mes séances', link: '/psychologue/mes-seances' },
  { title: 'Gérer mes étudiants', link: '/psychologue/mes-etudiants' },
  {

    title: 'Gérer mes facturations',
    link: '/psychologue/mes-remboursements',
    id: 'billing-header',
  },
  {

    title: 'Mes informations',
    link: '/psychologue/mon-profil',
    id: 'informations-header',
  },
];

const Header = () => {
  const location = useLocation();
  const { userStore: { user } } = useStore();

  const psychologistPage = location.pathname.startsWith('/psychologue');
  const studentPage = location.pathname.startsWith('/etudiant');
  return (
    <DSHeader>
      <HeaderBody>
        <Logo asLink={<Link to={studentPage ? '/etudiant' : '/'} title="Revenir à l'accueil" />}>
          Ministère de l&lsquo;Enseignement Supérieur et de la Recherche
        </Logo>
        <Service
          asLink={<Link to={studentPage ? '/etudiant' : '/'} />}
          title={`Santé Psy Étudiant${psychologistPage ? ' - Espace Psychologues' : ''}`}
          description="Accompagnement psychologique pour les étudiants"
        />
        <Tool>
          <ToolItemGroup>
            {user && psychologistPage && (
            <ToolItem asLink={<Link data-test-id="back-home-button" to="/" />}>Revenir à l&lsquo;accueil</ToolItem>
            )}
            {user && !psychologistPage && (
            <ToolItem asLink={<Link data-test-id="my-space-button" to="/psychologue/mes-seances" />}>
              Accéder à mon espace
            </ToolItem>
            )}
            {!user && !studentPage && (
              <ToolItem
                asLink={<Link to="/trouver-un-psychologue" />}
                icon="ri-search-line"
              >
                Trouver un psychologue
              </ToolItem>
            )}
            {!user && !studentPage && (
              <ToolItem asLink={<Link data-test-id="login-button" to="/psychologue/login" />} icon="ri-user-fill">
                Espace Psychologue
              </ToolItem>
            )}
            {user && (
            <ToolItem asLink={<Link data-test-id="logout-link" to="/psychologue/logout" />}>Déconnexion</ToolItem>
            )}
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      {!studentPage && (
      <HeaderNav>
        {psychologistPage && user
          ? connectedItems.map(item => (
            <NavItem
              id={item.id}
              key={item.title}
              current={location.pathname && location.pathname.startsWith(item.link)}
              title={item.title}
              asLink={<Link data-test-id={item.title} to={item.link} />}
            />
          ))
          : defaultItems.map(item => (
            <NavItem
              key={item.title}
              current={location.pathname && location.pathname === item.link}
              title={item.title}
              asLink={<Link data-test-id={item.title} to={item.link} />}
            />
          ))}
      </HeaderNav>
      )}
    </DSHeader>
  );
};

export default observer(Header);
