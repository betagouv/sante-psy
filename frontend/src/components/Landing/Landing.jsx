import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { Callout, CalloutText, CalloutTitle } from '@dataesr/react-dsfr';
import { HashLink } from 'react-router-hash-link';

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
      <Callout hasInfoIcon={false}>
        <CalloutTitle size="md">Prolongation du dispositif à la rentrée 2022</CalloutTitle>
        <CalloutText size="md">
          En raison des élections présidentielles et des changements de cabinets ministériels
          qui ont ralenti l&lsquo;intégration du dispositif au dispositif général Mon Psy,
          Santé Psy Étudiant se prolonge au moins jusqu&lsquo;au 31 décembre 2022.
          Les séances peuvent donc être effectuées jusqu&lsquo;à cette date.
          Pour plus d&lsquo;informations,
          {' '}
          <HashLink to="/faq">cliquez ici</HashLink>
          .
        </CalloutText>
      </Callout>
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

export default observer(Landing);
