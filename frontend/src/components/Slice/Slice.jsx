import { Button } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './slice.cssmodule.scss';

const Slice = ({
  color,
  title,
  description,
  buttonText,
  buttonLink,
  buttonIcon,
  buttonSecondary,
  hint,
  imageSrc,
  reverse,
  children,
  centerText,
  centerTitle,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames(
        color ? styles[color] : styles.container,
        reverse ? styles.reverse : '',
        centerText ? styles.centerText : '',
      )}
    >
      <div className={imageSrc ? styles.content : styles.onlyContent}>
        {title && (
          <h2 className={classNames(styles.title, centerTitle ? styles.centerTitle : '')}>
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
              secondary={!color || buttonSecondary}
              icon={buttonIcon}
              onClick={() => {
                if (buttonLink.startsWith('/')) {
                  navigate(buttonLink);
                } else {
                  window.open(buttonLink, '_blank');
                }
              }}
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
