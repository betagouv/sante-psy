import React from 'react';

import { Alert } from '@dataesr/react-dsfr';

const Notification = ({ message, type, onClose, children, className }) => (
  <div data-test-id={`notification-${type}`} className={className || 'fr-my-2w'}>
    <Alert
      type={type}
      description={message || children}
      closable
      onClose={onClose}
    />
  </div>
);

export default Notification;
