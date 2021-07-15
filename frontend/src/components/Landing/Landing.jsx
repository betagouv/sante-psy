import React from 'react';
import classnames from 'classnames';

import PsychologistFinder from './PsychologistFinder';
import StudentProcess from './StudentProcess';
import Psychologist from './Psychologist';
import FAQ from './Faq';
import Statistics from './Statistics';

import styles from './landing.cssmodule.scss';

const Landing = () => (
  <div className={styles.container} data-test-id="landingPageContainer">
    <div className={classnames(styles.sectionAlt, 'fr-container')}>
      <StudentProcess />
    </div>
    <div className={classnames(styles.section, 'fr-container')}>
      <PsychologistFinder />
    </div>
    <div className={classnames(styles.sectionLight, 'fr-container')}>
      <Psychologist />
    </div>
    <div className={classnames(styles.section, 'fr-container')}>
      <FAQ />
    </div>
    <div className={classnames(styles.sectionAlt, 'fr-container')}>
      <Statistics />
    </div>
  </div>
);

export default Landing;
