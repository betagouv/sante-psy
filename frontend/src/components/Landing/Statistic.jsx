import React from 'react';

import { displayStatistic } from 'services/string';
import styles from './statistic.cssmodule.scss';

const Statistic = ({ value, description }) => (
  <div className={styles.container} data-test-id={`statistic-${description}`}>
    <div
      data-test-id={`statistic-${description}-value`}
      className={styles.value}
    >
      <b>{displayStatistic(value)}</b>
      {' '}
      +
    </div>
    <div><b><span>{description}</span></b></div>
  </div>
);

export default Statistic;
