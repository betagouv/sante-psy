import classNames from 'classnames';
import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { Icon } from '@dataesr/react-dsfr';

import styles from './section.cssmodule.scss';

const Section = ({
  title,
  description,
  buttonText,
  buttonUrl,
  buttonUrlExternal,
  buttonIcon,
  buttonSecondary,
  buttonAlignment,
}) => (
  <div className={classNames(styles.container, styles[buttonAlignment])}>
    <div className={styles.text}>
      <h2 className={styles.text}>{title}</h2>
      <div className="fr-text--lead">
        {description}
      </div>
    </div>
    {buttonText && (
      buttonUrlExternal ? (
        <a
          className="fr-btn fr-btn--lg"
          href={buttonUrl}
          target="_blank"
          rel="noreferrer"
        >
          {buttonText}
          {buttonIcon && <Icon name={buttonIcon} iconPosition="right" />}
        </a>
      ) : (
        <div className={classNames({ 'button-secondary-container': buttonSecondary })}>
          <HashLink
            className={classNames('fr-btn fr-btn--lg', { 'fr-btn--secondary': buttonSecondary })}
            to={buttonUrl}
          >
            {buttonText}
          </HashLink>
        </div>
      )
    )}
  </div>
);

export default Section;
