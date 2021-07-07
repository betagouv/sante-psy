import React from 'react';
import { useLocation } from 'react-router-dom';

import { Tabs, Tab } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import FaqTab from 'components/Faq/FaqTab';

const Faq = () => {
  const query = new URLSearchParams(useLocation().search);
  const getDefaultTab = () => {
    const section = query.get('section');
    switch (section) {
      case 'psychologue':
        return 1;
      case 'medecin':
        return 2;
      case 'etudiant':
      default:
        return 0;
    }
  };
  return (
    <Page
      title="Foire aux questions"
      description="J'accède à la foire aux questions, que je sois étudiant, psychologue ou médecin
    afin de trouver une réponse à ma question"
      background="blue"
    >
      <Tabs
        defaultActiveTab={getDefaultTab()}
      >
        <Tab label="Je suis étudiant">
          <FaqTab type="student" />
        </Tab>
        <Tab label="Je suis psychologue">
          <FaqTab type="psychologist" />
        </Tab>
        <Tab label="Je suis médecin">
          <FaqTab type="doctor" />
        </Tab>
      </Tabs>
    </Page>
  );
};
export default Faq;
