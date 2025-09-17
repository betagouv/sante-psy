import React from 'react';

import Page from 'components/Page/Page';
import Section from 'components/Page/Section';

const LegalNotice = () => (
  <Page
    title="Mentions légales"
    withoutHeader
    textContent
    >
    <h1 className="secondaryPageTitle">Mentions légales - Santé Psy Étudiant</h1>
    <Section title="Éditeur de la Plateforme">
      <span>
        ministère de l&lsquo;Enseignement supérieur
        et de la Recherche
      </span>
      <p>
        Pavillon Boncourt
        <br />
        21 rue Descartes
        <br />
        75005 Paris
        <br />
        France
      </p>
      <p>Téléphone : 01 55 55 10 10</p>
    </Section>
    <Section title="Directeur de la publication">
      <p>
        Monsieur Philippe BAPTISTE
      </p>
    </Section>
    <Section title="Hébergement de la plateforme">
      <p>
        Scalingo SAS
        <br />
        13 rue Jacques Peirotes
        <br />
        67000 Strasbourg
        <br />
        France
      </p>
    </Section>
  </Page>
);

export default LegalNotice;
