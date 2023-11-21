import React from 'react';

import Mail from 'components/Footer/Mail';

import { useStore } from 'stores/';

import Page from 'components/Page/Page';
import Section from 'components/Page/Section';

const LegalNotice = () => {
  const { commonStore: { config } } = useStore();
  return (
    <Page
      title="Mentions légales"
      withoutHeader
      textContent
    >
      <h1 className="secondaryPageTitle">Mentions légales</h1>
      <Section title="Éditeur de la Plateforme">
        <p>
          La Plateforme
          {config.appName}
          {' '}
          est éditée par l&lsquo;Incubateur de services numériques de la
          Direction interministérielle du numérique (DINUM).
        </p>
        <p>
          Coordonnées :
          <br />
          Adresse : DINUM, 20 avenue de Ségur, 75007 Paris
          <br />
          SIRET : 12000101100010 (secrétariat général du gouvernement)
          <br />
          SIREN : 120 001 011
        </p>
      </Section>
      <Section title="Directeur de la publication">
        <span>
          MINISTÈRE DE L&lsquo;ENSEIGNEMENT SUPÉRIEUR
          ET DE LA RECHERCHE
        </span>
        <p>1 rue Descartes - 75231 Paris cedex 05</p>
      </Section>
      <Section title="Hébergement de la Plateforme">
        Ce site est hébergé en propre par Scalingo SAS, 15 avenue du Rhin, 67100 Strasbourg, France.
      </Section>
      <Section title="Sécurité">
        Le site est protégé par un certificat électronique,
        matérialisé pour la grande majorité des navigateurs par un cadenas.
        Cette protection participe à la confidentialité des échanges.
        En aucun cas les services associés à la plateforme ne seront à l’origine d’envoi de courriels pour demander
        la saisie d’informations personnelles.
      </Section>
      <Mail />
    </Page>
  );
};

export default LegalNotice;
