import classNames from 'classnames';
import React from 'react';

import styles from './underlinedTitle.cssmodule.scss';

const UnderlinedTitle = ({ title, big, className }) => (
  <div className={classNames(styles.container, className)}>
    <div className={big ? styles.bigUnderline : styles.underline} />
    <h1 className={big ? styles.bigTitle : styles.title}>{title}</h1>
  </div>
);

export default UnderlinedTitle;
