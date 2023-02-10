import React from 'react';
import classnames from 'classnames';
import { ButtonGroup, Icon } from '@dataesr/react-dsfr';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ links, simplified }) => (simplified ? (
  <div
    className={styles.link}
  >
    <a
      className={classnames('fr-btn fr-btn--secondary simplifiedButton')}
      href="/faq"
    >
      <Icon name="ri-todo-line" />
      Foire aux questions
    </a>
  </div>
)
  : (
    <>
      <h4>Supports téléchargeables</h4>
      <ButtonGroup isInlineFrom="xs" align="left" className="fr-mt-2w">
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
  ));

export default FaqProcess;
