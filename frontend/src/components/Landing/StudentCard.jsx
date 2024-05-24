import React from 'react';
import { Button, Icon } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

import styles from './studentCard.cssmodule.scss';
import classNames from 'classnames';

const allowedSizes = ['sm', 'md', 'lg'];

const StudentCard = ({ cardSize = 'md', titleSize = 'md', index, title, description, hint, image, buttonLink, buttonText, buttonIcon, buttonSecondary, anchor }) => {
  const navigate = useNavigate();

  const navigateToPathOrUrl = () => {
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank');
    } else {
      navigate(buttonLink);
    }
  };

  const validatedTitleSize = allowedSizes.includes(titleSize) ? titleSize : 'md';
  const validatedCardSize = allowedSizes.includes(cardSize) ? cardSize : 'md';

  const titleStyle = {
    'sm': styles.smallTitle,
    'md': styles.mediumTitle,
    'lg': styles.largeTitle,
  };

  const cardStyle = {
    'sm': styles.smallCard,
    'md': styles.mediumCard,
    'lg': styles.largeCard,
  };

  return (
    <div className={classNames(styles.container, cardStyle[validatedCardSize])}>
      { index &&
        <div className={styles.index}>
          <span id={anchor || undefined}>{index}</span>
        </div>
      }
      
      <img className={styles.image} src={`/images/${image}`} alt={image} />
      <h2 className={classNames(styles.title, titleStyle[validatedTitleSize])}>{title}</h2>
      {description && <div className={styles.description}>{description}</div>}
      {buttonLink && buttonText && (
      <Button className={styles.button} onClick={navigateToPathOrUrl} secondary={buttonSecondary ? true : false}>
        {buttonIcon && <Icon name={buttonIcon} size="lg" />}
        {buttonText}
      </Button>
      )}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
};

export default StudentCard;
