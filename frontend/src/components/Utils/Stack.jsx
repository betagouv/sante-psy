import React from 'react';
import styles from './stack.cssmodule.scss';

export const Stack = ({ children }) => (
  <div className={styles.stack}>{children}</div>
);
