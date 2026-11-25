import React from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';

const Notification = ({ message, type, onClose, children, className }) => (
  <div
    data-test-id={`notification-${type}`}
    className={className || 'fr-my-2w'}
  >
    <Alert
      severity={type}
      description={message || children}
      title=""
      closable
      onClose={onClose}
    />
  </div>
);

export default Notification;
