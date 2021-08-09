import React from 'react';
import SectionTitle from './SectionTitle';

import styles from './studentCard.cssmodule.scss';

const StudentCard = ({ index, title, description, image }) => (
  <div className={styles.container}>
    <div className={styles.index}>
      <div className={styles.line} />
      <span>{index}</span>
    </div>
    <SectionTitle>{title}</SectionTitle>
    <img className={styles.image} src={`/images/${image}.png`} alt={image} />
    <div className={styles.description}>{description}</div>
  </div>
);

export default StudentCard;
