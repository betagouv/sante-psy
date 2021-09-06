import classNames from 'classnames';
import React from 'react';
import { HashLink } from 'react-router-hash-link';

import styles from './section.cssmodule.scss';
import SectionTitle from './SectionTitle';

const Section = ({
  title,
  description,
  buttonText,
  buttonUrl,
  buttonUrlExternal,
  buttonSecondary,
  buttonAlignment,
}) => (
  <div className={classNames(styles.container, styles[buttonAlignment])}>
    <div className={styles.text}>
      <SectionTitle>{title}</SectionTitle>
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
        </a>
      ) : (
        <HashLink
          className={classNames('fr-btn fr-btn--lg', { 'fr-btn--secondary': buttonSecondary })}
          to={buttonUrl}
        >
          {buttonText}
        </HashLink>
      )
    )}
  </div>
);

export default Section;
