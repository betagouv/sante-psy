import React from 'react';
import { useLocation } from 'react-router-dom';

import { Tabs, Tab } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import FaqTab from 'components/Faq/FaqTab';

import items from 'services/faq/items';

const Faq = () => {
  const query = new URLSearchParams(useLocation().search);
  const getDefaultTab = () => {
    const section = query.get('section');
    return items[section] ? items[section].index : 0;
  };

  return (
    <Page
      title="Foire aux questions"
      description="J'accède à la foire aux questions, que je sois étudiant, psychologue ou médecin
    afin de trouver une réponse à ma question."
      background="blue"
      className="faqPage"
      dataTestId="faqPage"
    >
      <Tabs defaultActiveTab={getDefaultTab()}>
        <Tab label="Je suis étudiant">
          <FaqTab type="etudiant" />
        </Tab>
        <Tab label="Je suis psychologue">
          <FaqTab type="psychologue" />
        </Tab>
        <Tab label="Je suis médecin">
          <FaqTab type="medecin" />
        </Tab>
      </Tabs>
    </Page>
  );
};
export default Faq;
