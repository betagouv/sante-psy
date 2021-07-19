import React from 'react';

import styles from './underlinedTitle.cssmodule.scss';

const UnderlinedTitle = ({ title, big, className }) => (
  <div className={className}>
    <h1 className={big ? styles.bigTitle : styles.title}>{title}</h1>
  </div>
);

export default UnderlinedTitle;
