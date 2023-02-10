import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import { Tabs, Tab } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import FaqTab from 'components/Faq/FaqTab';

import items from 'services/faq/items';

import { useStore } from 'stores/';

import styles from './faq.cssmodule.scss';

const Faq = ({ simplified }) => {
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
      breadCrumbs={!simplified && [{ href: '/', label: 'Accueil' }]}
      withoutHeader
      textContent
    >
      <div ref={tabsRef}>
        <h1 className={classNames(simplified ? styles.simplifiedTitle : '')}>
          {simplified ? 'Questions fréquentes' : 'Foire aux questions'}
        </h1>
        <Tabs defaultActiveTab={getDefaultTab()}>
          <Tab label={smallText ? 'Étudiant' : 'Je suis étudiant'}>
            <FaqTab type="etudiant" simplified={simplified} />
          </Tab>
          <Tab label={smallText ? 'Psychologue' : 'Je suis psychologue'}>
            <FaqTab type="psychologue" simplified={simplified} />
          </Tab>
          {!simplified && (
            <Tab label={smallText ? 'Médecin' : 'Je suis médecin'}>
              <FaqTab type="medecin" simplified={simplified} />
            </Tab>
          )}
        </Tabs>
      </div>
    </Page>
  );
};
export default observer(Faq);
