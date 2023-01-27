import React from 'react';
import classnames from 'classnames';
import { ButtonGroup } from '@dataesr/react-dsfr';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ links }) => (
  <ButtonGroup isInlineFrom="xs" align="center" className="fr-mt-6w">
    {links.map(link => (
      <div
        className={styles.link}
        key={link.title}
      >
        <a
          className={classnames('fr-btn fr-btn--secondary')}
          href={`${__API__}${link.href}`}
          target="_blank"
          rel="noreferrer"
        >
          {link.title}
        </a>
      </div>
    ))}
  </ButtonGroup>
);

export default FaqProcess;
