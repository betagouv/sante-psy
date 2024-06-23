import React from 'react';

import Page from 'components/Page/Page';

const AccessibilityActionPlan = () => (
  <Page
    breadCrumbs={[
      { href: '/', label: 'Accueil' },
      { href: '/declaration-accessibilite', label: 'Déclaration d\'accessibilité' },
    ]}
    currentBreadCrumb="Plan d'action"
    title="Plan d'action d'accessibilité"
    withoutHeader
    textContent
  >
    <h1 className="secondaryPageTitle">Plan d’action d’accessibilité</h1>
    <p>
      Le plan d’action détaille les actions menées par Santé Psy Étudiant pour améliorer continuellement l’accessibilité du dispositif.
      Dernière mise à jour le 24 mai 2024.
    </p>
    <h2>Actions en cours et à venir en 2024</h2>
    <ul>
      <li>Obtention d’un financement UX & Accessibilité - été 2024</li>
      <li>Consolidation des parcours utilisateurs lors de la refonte du site - depuis 2023, et 2024</li>
      <li>Audit interne d’accessibilité - été 2024</li>
      <li>Correctifs d’accessibilité suite à l’audit interne - automne 2024</li>
      <li>Intégration des parcours utilisateur émergents - automne 2024</li>
      <li>Audit RGAA mené en interne ou par un prestataire externe - automne 2024</li>
      <li>Correction des erreurs relevées lors de l’audit externe - hiver 2024- 2025</li>
      <li>Suivi et évaluation régulière de l’accessibilité du site</li>
      <li>Mise en place de tests d’accessibilité automatisés</li>
    </ul>
  </Page>
);

export default AccessibilityActionPlan;
