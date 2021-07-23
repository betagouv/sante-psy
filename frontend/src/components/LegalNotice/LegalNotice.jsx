import React from 'react';
import { Link } from 'react-router-dom';

import Mail from 'components/Footer/Mail';

import { useStore } from 'stores/';

import Page from 'components/Page/Page';
import styles from './legalNotice.cssmodule.scss';

const LegalNotice = () => {
  const { commonStore: { config } } = useStore();
  return (
    <Page
      title="Mentions légales"
      background="blue"
    >
      <div className={styles.container}>
        <h2 className={styles.subtitle}>Éditeur de la Plateforme</h2>
        <p className="fr-mb-2w">
          La Plateforme
          {config.appName}
          , est éditée par l&lsquo;Incubateur de services numériques de la
          Direction interministérielle du numérique (DINUM).
        </p>
        <p className="fr-mb-2w">
          Coordonnées :
          <br />
          Adresse : DINUM, 20 avenue de Ségur, 75007 Paris
          <br />
          SIRET : 12000101100010 (secrétariat général du gouvernement)
          <br />
          SIREN : 120 001 011
        </p>
        <h2 className={styles.subtitle}>Directeur de la publication</h2>
        <p className="fr-mb-2w">
          MINISTÈRE DE L&lsquo;ENSEIGNEMENT SUPÉRIEUR,
          DE LA RECHERCHE ET DE L&lsquo;INNOVATION
        </p>
        <p className="fr-mb-2w">1 rue Descartes - 75231 Paris cedex 05</p>
        <div className={styles.sectionTitle}>
          <h2 className={styles.hebergement}>Hébergement de la Plateforme</h2>
          Ce site est hébergé en propre par Scalingo SAS, 15 avenue du Rhin, 67100 Strasbourg, France.
        </div>
        <div className={styles.sectionTitle}>
          <h2 className={styles.subtitle}>Accessibilité</h2>
          <p className="fr-mb-2w">
            La conformité aux normes d’accessibilité numérique est un objectif ultérieur.
            En attendant, nous tâchons de rendre ce site
            accessible à toutes et à tous :
          </p>
          <ul className={styles.list}>
            <li>Utilisation de composants accessibles (design system de l&lsquo;État)</li>
            <li>Respect des bonnes pratiques (Pilida, Opquast...)</li>
            <li>Tests manuels</li>
          </ul>
        </div>
        <h2 className={styles.subtitle}>Signaler un dysfonctionnement</h2>
        <p className="fr-mb-2w">
          Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un contenu
          ou une fonctionnalité du site, merci de nous en faire part en
          {' '}
          <Link to="/contact">
            nous contactant
          </Link>
          .
        </p>
        <p className="fr-mb-2w">
          Si vous n’obtenez pas de réponse rapide de notre part,
          vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
        </p>
        <div className={styles.sectionTitle}>
          <h2 className={styles.subtitle}>En savoir plus</h2>
          Pour en savoir plus sur la politique d’accessibilité numérique de l’État :
          {' '}
          <a
            href="http://references.modernisation.gouv.fr/accessibilite-numerique"
            target="_blank"
            rel="noreferrer"
          >
            http://references.modernisation.gouv.fr/accessibilite-numerique
          </a>
        </div>
        <div className={styles.sectionTitle}>
          <h2 className={styles.subtitle}>Sécurité</h2>
          Le site est protégé par un certificat électronique,
          matérialisé pour la grande majorité des navigateurs par un cadenas.
          Cette protection participe à la confidentialité des échanges.
          En aucun cas les services associés à la plateforme ne seront à l’origine d’envoi de courriels pour demander
          la saisie d’informations personnelles.
        </div>
        <Mail />
      </div>
    </Page>
  );
};

export default LegalNotice;
