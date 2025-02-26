import React from 'react';
import Slice from 'components/Slice/Slice';
import Statistic from './Statistic';
import styles from './statistics.cssmodule.scss';

const Statistics = ({ statistics }) => (
  <Slice>
    <div className={styles.header}>
      <div className={styles.title}>
        <b>Santé Psy Étudiant</b>
        {' '}
        à votre écoute
      </div>
      <div className={styles.description}>
        Pour tout étudiant de l’enseignement supérieur,
        dont la formation est reconnue par le ministère de l’Enseignement supérieur et de la Recherche.
      </div>
    </div>
    <div className={styles.separator} />
    <div className={styles.content}>
      {statistics.map(statistic => (
        <Statistic
          key={statistic.label}
          value={statistic.value}
          description={statistic.label}
          />
      ))}
    </div>
  </Slice>
);

export default Statistics;
