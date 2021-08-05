import React from 'react';

import styles from './statistic.cssmodule.scss';

const Statistic = ({ value, description }) => (
  <div className={styles.container} data-test-id={`statistic-${description}`}>
    <div
      data-test-id={`statistic-${description}-value`}
      className={styles.value}
    >
      {value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
    </div>
    <div>{description}</div>
  </div>
);

export default Statistic;
