import React from 'react';
import classnames from 'classnames';
import { Row, Col } from '@dataesr/react-dsfr';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ label, links }) => (
  <>
    <Row className={styles.label} spacing="mt-3w">
      <Col>
        {`Comment ça se passe pour les ${label} ?`}
      </Col>
    </Row>
    <Row justifyContent="center">
      {links.map(link => (
        <a
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
