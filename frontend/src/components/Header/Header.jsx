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
  { title: 'Espace Étudiant', link: '/espace-etudiant' },
  { title: 'Trouver un psychologue', link: '/trouver-un-psychologue' },
  { title: 'Foire aux questions', link: '/faq' },
  { title: 'Nous contacter', link: '/contact' },
  { title: 'Autres services', link: '/autres-services' },
  { title: 'Podcast', link: '/podcast' },
];

const psyItems = [
  { title: 'Tableau de bord', link: '/psychologue/tableau-de-bord', id: 'dashboard-header' },
  { title: 'Déclarer mes séances', link: '/psychologue/mes-seances', id: 'appointments-header' },
  { title: 'Suivi étudiants', link: '/psychologue/mes-etudiants' },
  {

    title: 'Facturation',
    link: '/psychologue/mes-remboursements',
    id: 'billing-header',
  },
  {

    title: 'Contact',
    link: '/contact',
  },
];

const studentItems = [
  { title: 'Accueil', link: '/etudiant/mes-seances', id: 'homepage-header' },
  { title: 'Trouver un psychologue', link: '/trouver-un-psychologue', id: 'find-psy-header' },
  { title: 'FAQ', link: '/faq', id: 'faq' },
];

const Header = () => {
  const location = useLocation();
  const { userStore: { user, role } } = useStore();

  const psychologistPage = location.pathname.startsWith('/psychologue');
  const publicStudentPage = location.pathname.startsWith('/info-etudiant');
  const studentPage = location.pathname.startsWith('/etudiant');

  const mySpaceUrl = role === 'student' ? '/etudiant/accueil' : '/psychologue/tableau-de-bord';

  const getItemsToDisplay = () => {
    if (!user) return defaultItems;
    if (psychologistPage) return psyItems;
    if (studentPage) return studentItems;
    return defaultItems;
  };

  const itemsToDisplay = getItemsToDisplay();

  return (
    <DSHeader>
      <HeaderBody>
        <Logo asLink={<Link to={publicStudentPage ? '/info-etudiant' : '/'} title="Revenir à l'accueil" />}>
          Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Espace
        </Logo>
        <Service
          asLink={<Link to={publicStudentPage ? '/info-etudiant' : '/'} />}
          title={`Santé Psy Étudiant${psychologistPage || studentPage ? ' - Mon espace' : ''}`}
          description="Accompagnement psychologique pour les étudiants"
        />
        <Tool>
          <ToolItemGroup>
            {user && psychologistPage && (
              <ToolItem asLink={<Link data-test-id="back-home-button" to="/" />}>Revenir à l&lsquo;accueil</ToolItem>
            )}
            {user && !psychologistPage && !studentPage && (
              <ToolItem asLink={<Link data-test-id="my-space-button" to={mySpaceUrl} />}>
                Accéder à mon espace
              </ToolItem>
            )}
            {!user && !publicStudentPage && (
              <ToolItem
                asLink={<Link to="/trouver-un-psychologue" />}
                icon="ri-search-line"
              >
                Trouver un psychologue
              </ToolItem>
            )}
            {!user && !publicStudentPage && (
              <ToolItem asLink={<Link data-test-id="login-button" to="/login" />} icon="ri-user-fill">
                Mon Espace
              </ToolItem>
            )}
            {user && (
              <ToolItem asLink={<Link data-test-id="logout-link" to="/logout" />}>Déconnexion</ToolItem>
            )}
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      {!publicStudentPage && (
        <HeaderNav>
          {user && itemsToDisplay
            ? itemsToDisplay.map(item => (
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
