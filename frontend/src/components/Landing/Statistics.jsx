import React, { useEffect, useState } from 'react';
import agent from 'services/agent';
import Statistic from './Statistic';

import styles from './statistics.cssmodule.scss';

const Statistics = () => {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    agent.Statistics.getAll().then(setStatistics);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Santé Psy Étudiant en quelques chiffres
      </div>
      <div className={styles.content}>
        {statistics.map(
          statistic => (
            <Statistic
              key={statistic.label}
              value={statistic.value}
              description={statistic.label}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default Statistics;
