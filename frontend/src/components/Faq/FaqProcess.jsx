import React from 'react';
import classnames from 'classnames';
import { ButtonGroup, Row } from '@dataesr/react-dsfr';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ label, links }) => (
  <>
    <Row spacing="mt-3w mb-1w" justifyContent="center" className={styles.label}>
      {`Comment ça se passe pour les ${label} ?`}
    </Row>
    <ButtonGroup isInlineFrom="xs" align="center">
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
  </>
);

export default FaqProcess;
