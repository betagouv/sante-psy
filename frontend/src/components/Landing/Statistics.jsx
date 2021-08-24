import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import agent from 'services/agent';
import { useStore } from 'stores/';
import Section from './Section';
import Statistic from './Statistic';

import styles from './statistics.cssmodule.scss';

const Statistics = () => {
  const { commonStore: { statistics, setStatistics } } = useStore();

  useEffect(() => {
    if (!statistics) {
      agent.Statistics.getAll().then(setStatistics);
    }
  }, []);

  return (
    <Section
      title="Santé Psy Étudiant en quelques chiffres"
      description={(
        <div className={styles.content}>
          {statistics && statistics.map(
            statistic => (
              <Statistic
                key={statistic.label}
                value={statistic.value}
                description={statistic.label}
              />
            ),
          )}
        </div>
        )}
    />
  );
};

export default observer(Statistics);
