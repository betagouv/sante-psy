import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { observer } from 'mobx-react';

import { useStore } from 'stores/';

import Notification from './Notification';

const GlobalNotification = ({ className }) => {
  const { commonStore: { notification, setNotification } } = useStore();
  const location = useLocation();

  useEffect(
    () => {
      setNotification((location.state && location.state.notification) || null);
    },
    [location],
  );

  if (notification && notification.message
    && (location.pathname.startsWith('/') || !notification.displayOnlyOnPsyPages)) {
    return (
      <Notification
        {...notification}
        className={className}
        onClose={() => setNotification(null)}
      />
    );
  }

  return null;
};

export default observer(GlobalNotification);
