import React from 'react';

const Notification = ({ message, error }) => (
  <div className={`fr-callout fr-fi-alert-line fr-mb-3w ${error ? 'bg-orange-warning' : ''}`}>
    <p className="fr-text--md fr-mb-1v">{message}</p>
    <span className="fr-fi-close-line close-notification" />
  </div>
);

export default Notification;
