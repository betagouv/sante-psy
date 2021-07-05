import React from 'react';

import styles from './statistic.cssmodule.scss';

const Statistic = ({ value, description }) => (
  <div data-test-id={`statistic-${description}`}>
    <div
      data-test-id={`statistic-${description}-value`}
      className={styles.value}
    >
      {value}
    </div>
    <div className={styles.description}>{description}</div>
  </div>
);

export default Statistic;
