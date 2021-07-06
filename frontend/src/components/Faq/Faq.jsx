import React from 'react';

import { Tabs, Tab } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import FaqTab from 'components/Faq/FaqTab';

const Faq = () => (
  <Page
    title="Foire aux questions"
    description="J'accède à la foire aux questions, que je sois étudiant, psychologue ou médecin
    afin de trouver une réponse à ma question"
    background="blue"
  >
    <Tabs>
      <Tab label="Je suis étudiant">
        <FaqTab type="student" />
      </Tab>
      <Tab label="Je suis psychologue">
        <FaqTab type="psychologist" />
      </Tab>
      <Tab label="Je suis médecin">
        {/* <FaqTab type="doctor" /> */}
      </Tab>
    </Tabs>
  </Page>
);
export default Faq;
