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
      <li>Obtention d’un financement UX & Accessibilité</li>
      <li>Finalisation des développements de refonte du site</li>
      <li>Phase de remise en accessibilité après la refonte du site</li>
      <li>Mise en place de tests d’accessibilité automatisés</li>
      <li>Audit RGAA mené en interne ou par un prestataire externe</li>
      <li>Correction des erreurs relevées au cours de l’audit</li>
      <li>Suivi et évaluation régulière de l’accessibilité du site</li>
    </ul>
  </Page>
);

export default AccessibilityActionPlan;
