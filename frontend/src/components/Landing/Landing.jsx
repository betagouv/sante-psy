import React, { useEffect } from 'react';
import classnames from 'classnames';

import { Callout, CalloutText } from '@dataesr/react-dsfr';

import { useStore } from 'stores/';
import PsychologistFinder from './PsychologistFinder';
import StudentProcess from './StudentProcess';
import Statistics from './Statistics';

import styles from './landing.cssmodule.scss';

import Section from './Section';

const Landing = () => {
  const { commonStore: { config } } = useStore();

  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div className={classnames(styles.container, 'fr-container')} data-test-id="landingPageContainer">
      <div className={styles.sectionCallout}>
        <Callout hasInfoIcon={false}>
          {/* <CalloutTitle as="h3">Prolongation du dispositif</CalloutTitle> */}
          <CalloutText size="md">
            Prolongation du dispositif jusqu&lsquo;au 31 août 2022 donnant droit jusqu&lsquo;à 8 séances
            sans avance de frais
          </CalloutText>
        </Callout>
      </div>
      <div className={styles.sectionAlt}>
        <StudentProcess />
      </div>
      <div className={styles.section}>
        <PsychologistFinder />
      </div>
      <div className={styles.sectionLight}>
        <Section
          title="Vous êtes psychologue ?"
          description="Vous souhaitez participer au programme d&lsquo;accompagnement
        psychologique des étudiants ? Merci !"
          buttonAlignment="left"
          buttonText="Commencer mon inscription"
          buttonUrl={config.demarchesSimplifieesUrl}
          buttonUrlExternal
        />
      </div>
      <div className={styles.section}>
        <Section
          title="Vous avez une question ?"
          description="Retrouvez les réponses aux questions les plus fréquemment posées."
          buttonAlignment="right"
          buttonText="Consulter la foire aux questions"
          buttonUrl="/faq"
          buttonSecondary
        />
      </div>
      <div className={styles.sectionAlt}>
        <Statistics />
      </div>
    </div>
  );
};

export default Landing;
