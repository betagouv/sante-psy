import classNames from 'classnames';
import React from 'react';
import { HashLink } from 'react-router-hash-link';

import styles from './section.cssmodule.scss';
import Button from '@codegouvfr/react-dsfr/Button';

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
      <div className="fr-text--lead">{description}</div>
    </div>
    {buttonText &&
      (buttonUrlExternal ? (
        <Button
          size="large"
          linkProps={{ to: buttonUrl }}
          iconId={buttonIcon}
          iconPosition="right"
        >
          {buttonText}
        </Button>
      ) : (
        <div
          className={classNames({
            'button-secondary-container': buttonSecondary,
          })}
        >
          <HashLink
            className={classNames('fr-btn fr-btn--lg', {
              'fr-btn--secondary': buttonSecondary,
            })}
            to={buttonUrl}
          >
            {buttonText}
          </HashLink>
        </div>
      ))}
  </div>
);

export default Section;
