import React from 'react';
import styles from './errorMessage.cssmodule.scss';

const ErrorMessage = ({ message, ...otherProps }) => (
  <p className={styles.errorMessage} {...otherProps}>
    {message}
  </p>
);

export default ErrorMessage;
