import { Button } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './slice.cssmodule.scss';

const Slice = ({ color, title, description, buttonText, buttonLink, buttonIcon, hint, imageSrc, reverse, children }) => {
  const navigate = useNavigate();
  return (
    <div className={classNames(color ? styles[color] : styles.container, reverse ? styles.reverse : '')}>
      <div className={styles.content}>
        {title && (
        <h2 className={styles.title}>
          {title}
        </h2>
        )}
        {description && (
        <div className={styles.description}>
          {description}
        </div>
        )}
        {buttonText && buttonLink && (
          <div className={styles.button}>
            <Button
              secondary={!color}
              icon={buttonIcon}
              onClick={() => navigate(buttonLink)}
            >
              {buttonText}
            </Button>
          </div>
        )}
        {hint && <div className={styles.hint}>{hint}</div>}
        {children}
      </div>
      {imageSrc && <img className={styles.image} src={imageSrc} alt="" />}
    </div>
  );
};

export default Slice;
