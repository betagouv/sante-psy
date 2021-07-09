import React from 'react';
import classnames from 'classnames';
import { Row } from '@dataesr/react-dsfr';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ label, links }) => (
  <>
    <Row spacing="mt-3w mb-1w" justifyContent="center" className={styles.label}>
      {`Comment ça se passe pour les ${label} ?`}
    </Row>
    <Row justifyContent="center" spacing="my-1w">
      {links.map(link => (
        <a
          key={link.title}
          className={classnames('fr-btn fr-btn--secondary', styles.link)}
          href={`${__API__}${link.href}`}
          target="_blank"
          rel="noreferrer"
        >
          {link.title}
        </a>
      ))}
    </Row>
  </>
);

export default FaqProcess;
