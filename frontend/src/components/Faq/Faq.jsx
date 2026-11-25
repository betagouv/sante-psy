import React, { useEffect, useRef, useState } from 'react';

import { observer } from 'mobx-react';
import classNames from 'classnames';

import { Tabs } from '@codegouvfr/react-dsfr/Tabs';
import { Button } from '@codegouvfr/react-dsfr/Button';

import Page from 'components/Page/Page';
import FaqTab from 'components/Faq/FaqTab';

import styles from './faq.cssmodule.scss';

const BREAKPOINT_SM = 600;

const Faq = ({ simplified }) => {
  const tabsRef = useRef(null);
  const [smallText, setSmallText] = useState(false);

  const getLabel = () => {
    if (tabsRef.current) {
      const { width } = tabsRef.current.getBoundingClientRect();
      if (width < BREAKPOINT_SM) {
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
      dataTestId="faqPage"
      breadCrumbs={!simplified && [{ href: '/', label: 'Accueil' }]}
      withoutHeader
      textContent
    >
      <div className={styles.faq} ref={tabsRef}>
        <h1
          className={classNames(
            simplified ? styles.simplifiedTitle : 'secondaryPageTitle',
          )}
        >
          {simplified ? 'Questions fréquentes' : 'Foire aux questions'}
        </h1>
        <Tabs
          tabs={[
            {
              tabId: 'etudiant',
              label: smallText ? 'Étudiant' : 'Je suis étudiant',
              content: <FaqTab type="etudiant" simplified={simplified} />,
            },
            {
              tabId: 'psychologue',
              label: smallText ? 'Psychologue' : 'Je suis psychologue',
              content: <FaqTab type="psychologue" simplified={simplified} />,
            },
            ...(!simplified
              ? [
                  {
                    tabId: 'ecole',
                    label: smallText ? 'École' : 'Je suis une école',
                    content: <FaqTab type="ecole" simplified={simplified} />,
                  },
                ]
              : []),
            {
              tabId: 'espaceEtudiant',
              label: 'Espace Étudiant',
              content: <FaqTab type="espaceEtudiant" simplified={simplified} />,
            },
          ]}
        />
      </div>
      {!simplified && (
        <div className={styles.container}>
          <div className={styles.text}>
            Vous ne trouvez pas la réponse à votre question&#x00A0;?
          </div>
          <Button linkProps={{ to: '/contact/formulaire' }}>
            Contactez notre équipe
          </Button>
        </div>
      )}
    </Page>
  );
};
export default observer(Faq);
