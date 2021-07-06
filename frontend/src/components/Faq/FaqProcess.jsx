import React from 'react';
import { Row, Col } from '@dataesr/react-dsfr';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ label, link }) => (
  <Row spacing="pt-3w" alignItems="middle" gutters>
    <Col>
      <div className={styles.label}>
        Comment ça se passe pour les
        {' '}
        { label }
        {' '}
        ?
      </div>
    </Col>
    <Col>
      <a
        className="fr-btn fr-btn--secondary"
        href={`${__API__}${link}`}
        target="_blank"
        rel="noreferrer"
      >
        En savoir plus
      </a>
    </Col>
  </Row>
);

export default FaqProcess;
