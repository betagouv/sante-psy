import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Tabs, Tab } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import FaqTab from 'components/Faq/FaqTab';

import items from 'services/faq/items';

import { useStore } from 'stores/';

const Faq = () => {
  const tabsRef = useRef(null);
  const [smallText, setSmallText] = useState(false);

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

  const getLabel = () => {
    if (tabsRef.current) {
      const { width } = tabsRef.current.getBoundingClientRect();
      if (width < 600) {
        return setSmallText(true);
      }
    }
    return setSmallText(false);
  };

  useEffect(() => {
    window.addEventListener('resize', getLabel);
    return () => window.removeEventListener('resize', getLabel);
  }, []);

  useEffect(() => {
    getLabel();
  }, [tabsRef]);

  return (
    <Page
      title="FAQ"
      className="faqPage"
      dataTestId="faqPage"
      withoutHeader
      textContent
    >
      <div ref={tabsRef}>
        <h1>Foire aux questions</h1>
        <Tabs defaultActiveTab={getDefaultTab()}>
          <Tab label={smallText ? 'Étudiant' : 'Je suis étudiant'}>
            <FaqTab type="etudiant" />
          </Tab>
          <Tab label={smallText ? 'Psychologue' : 'Je suis psychologue'}>
            <FaqTab type="psychologue" />
          </Tab>
          <Tab label={smallText ? 'Médecin' : 'Je suis médecin'}>
            <FaqTab type="medecin" />
          </Tab>
        </Tabs>
      </div>
    </Page>
  );
};
export default observer(Faq);
