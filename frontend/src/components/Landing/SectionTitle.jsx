import React from 'react';

import styles from './sectionTitle.cssmodule.scss';

const SectionTitle = ({ children }) => (
  <div className={styles.title}>
    {children}
  </div>
);

export default SectionTitle;
