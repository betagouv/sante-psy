import React from 'react';
import { Button, Icon } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

import styles from './card.cssmodule.scss';

const Card = ({ customStyles = {}, index, title, description, hint, image, link, buttonText, buttonIcon, fullClickable, anchor }) => {
  const navigate = useNavigate();

  const navigateToPathOrUrl = () => {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  return (
    <div
      className={customStyles?.card ? styles[customStyles.card] : styles.bigContainer}
      onClick={fullClickable ? navigateToPathOrUrl : undefined}
    >
      {index && (
        <div className={styles.index}>
          <span id={anchor || undefined}>{index}</span>
        </div>
      )}
      <img className={customStyles?.image ? styles[customStyles.image] : styles.image} src={`/images/${image}`} alt={title} />
      <h2 className={customStyles?.title ? styles[customStyles.title] : styles.bigTitle}>{title}</h2>
      {description && <div className={styles.description}>{description}</div>}
      {link && buttonText && !fullClickable && (
        <Button className={styles.button} onClick={navigateToPathOrUrl}>
          {buttonIcon && <Icon name={buttonIcon} size="lg" />}
          {buttonText}
        </Button>
      )}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
};

export default Card;
