import { Button } from '@dataesr/react-dsfr';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './studentCard.cssmodule.scss';

const StudentCard = ({ big, index, title, description, hint, image, buttonLink, buttonText }) => {
  const navigate = useNavigate();
  return (
    <div className={big ? styles.bigContainer : styles.container}>
      <div className={styles.index}>
        <span>{index}</span>
      </div>
      <img className={styles.image} src={`/images/${image}.svg`} alt={image} />
      <h2 className={big ? styles.bigTitle : styles.title}>{title}</h2>
      {description && <div className={styles.description}>{description}</div>}
      {hint && <div className={styles.hint}>{hint}</div>}
      {buttonLink && buttonText && <Button onClick={() => navigate(buttonLink)}>{buttonText}</Button>}
    </div>
  );
};

export default StudentCard;
