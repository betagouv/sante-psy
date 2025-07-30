import React from 'react';

import Page from 'components/Page/Page';
import Section from 'components/Page/Section';

const AccessibilityDeclaration = () => (
  <Page
    breadCrumbs={[{ href: '/', label: 'Accueil' }]}
    currentBreadCrumb="Déclaration d'accessibilité"
    title="Déclaration d'accessibilité"
    withoutHeader
    textContent
  >
    <h1 className="secondaryPageTitle">Déclaration d’accessibilité</h1>
    <p>
      Établie le
      {' '}
      <span>24 mai 2024</span>
      {/* no space */}
      .
    </p>
    <p>
      <span>Ministère de l’Enseignement Supérieur et de la Recherche</span>
      {' '}
      s’engage à rendre son service accessible, conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005.
    </p>
    <p>
      À cette fin, nous mettons en œuvre la stratégie et les actions
      suivantes&nbsp;:
    </p>
    <ul>
      <li><a href="https://beta.gouv.fr/accessibilite/schema-pluriannuel">Schéma pluriannuel</a></li>
      <li><a href="https://santepsy.etudiant.gouv.fr/declaration-accessibilite/plan-action">Plan d’action 2024</a></li>
    </ul>
    <p>
      Cette déclaration d’accessibilité s’applique à
      {' '}
      <strong>Santé Psy Étudiant</strong>
      {' '}
      <span>(https://santepsy.etudiant.gouv.fr/)</span>
      {/* no space */}
      .
    </p>
    <Section title="État de conformité">
      <p>
        <strong>Santé Psy Etudiant</strong>
        {' '}
        est
        {' '}
        <strong><span data-printfilter="lowercase">non conforme</span></strong>
        {' '}
        avec le
        {' '}
        <abbr title="Référentiel général d’amélioration de l’accessibilité">RGAA</abbr>
        {/* no space */}
        .
        {' '}
        <span>Le site n’a encore pas été audité.</span>
      </p>
      <p>
        En raison des évolutions continues de notre plateforme, avec des fonctionnalités en cours de développement et de modifications fréquentes, il n’est actuellement pas possible d’effectuer un audit d’accessibilité complet. Nous nous engageons à réaliser cet audit une fois la phase de développement stabilisée.
      </p>
    </Section>
    <Section title="Amélioration et contact">
      <p>
        Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de
        Santé Psy Etudiant pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
      </p>
      <ul className="basic-information feedback h-card">
        <li>
          Formulaire de contact&nbsp;:
          {' '}
          <a href="https://santepsy.etudiant.gouv.fr/contact/formulaire">https://santepsy.etudiant.gouv.fr/contact/formulaire</a>
        </li>
        <li>
          Adresse&nbsp;:
          {' '}
          <span>MINISTÈRE DE L‘ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE 1 rue Descartes - 75231 Paris cedex 05</span>
        </li>
      </ul>
    </Section>

    <Section title="Voie de recours">
      <p>
        Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au responsable du site internet un
        défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez
        pas obtenu de réponse satisfaisante.
      </p>
      <p>Vous pouvez&nbsp;:</p>
      <ul>
        <li>
          Écrire un message au
          {' '}
          <a href="https://formulaire.defenseurdesdroits.fr/">Défenseur des droits</a>
          {/* no space */}
        </li>
        <li>
          Contacter
          {' '}
          <a href="https://www.defenseurdesdroits.fr/saisir/delegues">le délégué du Défenseur des droits dans votre région</a>
          {/* no space */}
        </li>
        <li>
          Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:
          <br />
          Défenseur des droits
          <br />
          Libre réponse 71120 75342 Paris CEDEX 07
        </li>
      </ul>
    </Section>
    <hr />
    <p>
      Cette déclaration d’accessibilité a été créé le
      {' '}
      <span>24 mai 2024</span>
      {' '}
      grâce au
      {' '}
      <a href="https://betagouv.github.io/a11y-generateur-declaration/#create">Générateur de Déclaration d’Accessibilité de BetaGouv</a>
      {/* no space */}
      .
    </p>
  </Page>
);

export default AccessibilityDeclaration;
