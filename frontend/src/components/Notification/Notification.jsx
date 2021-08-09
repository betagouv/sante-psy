import React from 'react';

import { Alert } from '@dataesr/react-dsfr';

const Notification = ({ message, type, onClose, children }) => (
  <div data-test-id={`notification-${type}`}>
    <Alert
      type={type}
      title={message || children}
      closable
      onClose={onClose}
    />
  </div>
);

export default Notification;
