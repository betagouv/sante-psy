import React, { useState } from 'react';
import classnames from 'classnames';

import styles from './notification.cssmodule.scss';

const Notification = ({ message, success, onClose, children }) => {
  const [show, setShow] = useState(true);

  const close = () => {
    if (onClose) {
      onClose();
    }
    setShow(false);
  };

  return show ? (
    <div
      className={classnames(
        'fr-callout',
        'fr-mb-3w',
        { [styles.error]: !success },
        { 'fr-fi-alert-line': !success },
        { 'fr-fi-information-line': success },
      )}
    >
      <p className="fr-text--md fr-mb-1v">{message || children}</p>
      <span className="fr-fi-close-line close-notification" onClick={close} />
    </div>
  ) : (
    <></>
  );
};

export default Notification;
