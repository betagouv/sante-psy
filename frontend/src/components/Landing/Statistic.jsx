import React from 'react';

import styles from './statistic.cssmodule.scss';

const Statistic = ({ value, description }) => (
  <div className={styles.container} data-test-id={`statistic-${description}`}>
    <div
      data-test-id={`statistic-${description}-value`}
      className={styles.value}
    >
      <b>{(Math.floor(value / 1000) * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</b>
      {' '}
      +
    </div>
    <div><b>{description}</b></div>
  </div>
);

export default Statistic;
