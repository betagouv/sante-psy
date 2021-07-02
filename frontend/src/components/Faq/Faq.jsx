import React from 'react';

import Page from 'components/Page/Page';
import { Tabs, Tab } from '@dataesr/react-dsfr';

const Faq = () => (
  <Page
    title="Foire aux questions"
    description="J'accède à la foire aux questions, que je sois étudiant, psychologue ou médecin
    afin de trouver une réponse à ma question"
    background="blue"
  >
    <Tabs>
      <Tab label="Je suis étudiant" />
      <Tab label="Je suis psychologue" />
      <Tab label="Je suis médecin" />
    </Tabs>
  </Page>
);

export default Faq;
