import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Header } from '@codegouvfr/react-dsfr/Header';

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
  {
    title: 'Tableau de bord',
    link: '/psychologue/tableau-de-bord',
    id: 'dashboard-header',
  },
  {
    title: 'Déclarer mes séances',
    link: '/psychologue/mes-seances',
    id: 'appointments-header',
  },
  { title: 'Suivi étudiants', link: '/psychologue/mes-etudiants' },
  {
    title: 'Facturation',
    link: '/psychologue/mes-remboursements',
    id: 'billing-header',
  },
  { title: 'Contact', link: '/contact' },
];

const studentItems = [
  { title: 'Accueil', link: '/etudiant/mes-seances', id: 'homepage-header' },
  {
    title: 'Trouver un psychologue',
    link: '/trouver-un-psychologue',
    id: 'find-psy-header',
  },
  { title: 'FAQ', link: '/faq', id: 'faq' },
  { title: 'Podcast', link: '/podcast' },
];

const AppHeader = () => {
  const location = useLocation();
  const {
    userStore: { user, role },
  } = useStore();

  const psychologistPage = location.pathname.startsWith('/psychologue');
  const publicStudentPage = location.pathname.startsWith('/info-etudiant');
  const studentPage = location.pathname.startsWith('/etudiant');

  const mySpaceUrl =
    role === 'student' ? '/etudiant/accueil' : '/psychologue/tableau-de-bord';

  const getItemsToDisplay = () => {
    if (!user) return defaultItems;
    if (psychologistPage) return psyItems;
    if (studentPage) return studentItems;
    return defaultItems;
  };

  const itemsToDisplay = getItemsToDisplay();

  const quickAccessItems = [
    ...(user && psychologistPage
      ? [
          {
            text: "Revenir à l'accueil",
            linkProps: {
              to: '/',
              'data-test-id': 'back-home-button',
              as: Link,
            },
          },
        ]
      : []),
    ...(user && !psychologistPage && !studentPage
      ? [
          {
            text: 'Accéder à mon espace',
            linkProps: {
              to: mySpaceUrl,
              'data-test-id': 'my-space-button',
              as: Link,
            },
          },
        ]
      : []),
    ...(!user && !publicStudentPage
      ? [
          {
            text: 'Trouver un psychologue',
            iconId: 'fr-icon-search-line',
            linkProps: { to: '/trouver-un-psychologue', as: Link },
          },
          {
            text: 'Mon Espace',
            iconId: 'fr-icon-user-fill',
            linkProps: {
              to: '/login',
              'data-test-id': 'login-button',
              as: Link,
            },
          },
        ]
      : []),
    ...(user
      ? [
          {
            text: 'Déconnexion',
            linkProps: {
              to: '/logout',
              'data-test-id': 'logout-link',
              as: Link,
            },
          },
        ]
      : []),
  ];

  return (
    <Header
      brandTop={
        <>
          République
          <br />
          française
        </>
      }
      serviceTitle={`Santé Psy Étudiant${psychologistPage || studentPage ? ' - Mon espace' : ''}`}
      serviceTagline="Accompagnement psychologique pour les étudiants"
      homeLinkProps={{
        to: publicStudentPage ? '/info-etudiant' : '/',
        title: "Revenir à l'accueil",
        as: Link,
      }}
      quickAccessItems={quickAccessItems}
      navigation={
        !publicStudentPage
          ? itemsToDisplay.map((item) => ({
              text: item.title,
              linkProps: {
                to: item.link,
                'data-test-id': item.title,
                as: Link,
              },
              isActive: user
                ? location.pathname.startsWith(item.link)
                : location.pathname === item.link,
            }))
          : []
      }
    />
  );
};

export default observer(AppHeader);
