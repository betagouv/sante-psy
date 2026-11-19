import React from 'react';
import classnames from 'classnames';

import styles from './faqProcess.cssmodule.scss';

const FaqProcess = ({ links, simplified }) =>
  simplified ? (
    <div className={styles.link}>
      <a
        className={classnames('fr-btn fr-btn--secondary simplifiedButton')}
        href="/faq"
      >
        <span className="fr-icon-clipboard-line" />
        Foire aux questions
      </a>
    </div>
  ) : (
    links && (
      <>
        <h4>Supports téléchargeables</h4>
        <div className="fr-btns-group fr-btns-group--inline fr-mt-2w">
          {' '}
          {links.map((link) => (
            <div className={styles.link} key={link.title}>
              <a
                className="fr-btn fr-btn--secondary"
                href={`${__API__}${link.href}`}
                target="_blank"
                rel="noreferrer"
              >
                {link.title}
              </a>
            </div>
          ))}
        </div>
      </>
    )
  );

export default FaqProcess;
