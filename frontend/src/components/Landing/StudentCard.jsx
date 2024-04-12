import React from 'react';
import { Button, Icon } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

import styles from './studentCard.cssmodule.scss';

const StudentCard = ({ big, index, title, description, hint, image, buttonLink, buttonText, buttonIcon, anchor }) => {
  const navigate = useNavigate();

  const navigateToPathOrUrl = () => {
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank');
    } else {
      navigate(buttonLink);
    }
  };

  return (
    <div className={big ? styles.bigContainer : styles.container}>
      <div className={styles.index}>
        <span id={anchor && anchor.index === index ? anchor.text : undefined}>{index}</span>
      </div>
      <img className={styles.image} src={`/images/${image}.svg`} alt={image} />
      <h2 className={big ? styles.bigTitle : styles.title}>{title}</h2>
      {description && <div className={styles.description}>{description}</div>}
      {buttonLink && buttonText && (
      <Button className={styles.button} onClick={navigateToPathOrUrl}>
        {buttonIcon && <Icon name={buttonIcon} size="lg" />}
        {buttonText}
      </Button>
      )}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
};

export default StudentCard;
