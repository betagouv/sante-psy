import React from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Tabs, Tab } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import FaqTab from 'components/Faq/FaqTab';

import items from 'services/faq/items';

import { useStore } from 'stores/';
import styles from './faq.cssmodule.scss';

const Faq = () => {
  const query = new URLSearchParams(useLocation().search);
  const { userStore: { user } } = useStore();
  const getDefaultTab = () => {
    const section = query.get('section');
    if (items[section]) {
      return items[section].index;
    }

    if (user) {
      return items.psychologue.index;
    }

    return 0;
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
export default observer(Faq);
