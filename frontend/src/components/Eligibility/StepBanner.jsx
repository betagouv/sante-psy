import React from 'react';
import styles from './stepBanner.cssmodule.scss';
import { Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

const StepBanner = ({number, text, buttonText, buttonIcon, buttonLink}) => {

  const navigate = useNavigate();

  const navigateToPathOrUrl = () => {
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank');
    } else {
      navigate(buttonLink);
    }
  };

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.number}>{number}</div>
        <div id="step-banner-title">{text}</div>
      </div>
      
      <Button 
        iconId="sm"
        icon={buttonIcon}
        secondary
        className={styles.button}
        onClick={navigateToPathOrUrl}

      >
        {buttonText}
      </Button>
    </div>
  );
};

export default StepBanner;