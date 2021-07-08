import React from 'react';
import classnames from 'classnames';
import { Row, Col } from '@dataesr/react-dsfr';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ label, links }) => (
  <div className={styles.container}>
    <Row className={styles.label}>
      <Col>
        {`Comment ça se passe pour les ${label} ?`}
      </Col>
    </Row>
    <Row justifyContent="center" spacing="pt-1w">
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
  </div>
);

export default FaqProcess;
