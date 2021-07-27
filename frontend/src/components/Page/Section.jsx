import React from 'react';

import styles from './section.cssmodule.scss';

const Section = ({ title, children }) => (
  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
);

export default Section;
