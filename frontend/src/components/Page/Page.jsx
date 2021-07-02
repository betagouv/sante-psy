import React from 'react';
import classnames from 'classnames';

import styles from './page.cssmodule.scss';

const Page = ({ title, description, background, children }) => (
  <div className={classnames(styles.page, styles[background], 'fr-container')}>
    <div className={styles.container}>
      <div className={styles.sectionTitle}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      {children}
    </div>
  </div>
);

export default Page;
