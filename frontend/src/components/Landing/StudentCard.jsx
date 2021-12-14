import React from 'react';
import { useTheme } from '@dataesr/react-dsfr';

import styles from './studentCard.cssmodule.scss';

const StudentCard = ({ index, title, description, image }) => {
  const theme = useTheme();
  return (
    <div className={styles.container}>
      <div className={styles.index}>
        <div className={styles.line} />
        <span>{index}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <img className={styles.image} src={`/images/${image}${theme === 'dark' ? '_dm' : ''}.png`} alt={image} />
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default StudentCard;
