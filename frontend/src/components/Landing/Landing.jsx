import React from 'react';
import classnames from 'classnames';

import PsychologistFinder from './PsychologistFinder';
import StudentProcess from './StudentProcess';
import Psychologist from './Psychologist';
import FAQ from './Faq';
import Statistics from './Statistics';

import styles from './landing.cssmodule.scss';

const Landing = () => (
  <div className={classnames(styles.container, 'fr-container')} data-test-id="landingPageContainer">
    <div className={styles.sectionAlt}>
      <StudentProcess />
    </div>
    <div className={styles.section}>
      <PsychologistFinder />
    </div>
    <div className={styles.sectionLight}>
      <Psychologist />
    </div>
    <div className={styles.section}>
      <FAQ />
    </div>
    <div className={styles.sectionAlt}>
      <Statistics />
    </div>
  </div>
);

export default Landing;
