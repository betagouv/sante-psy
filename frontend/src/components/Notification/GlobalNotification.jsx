import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { observer } from 'mobx-react';

import { useStore } from 'stores/';

import Notification from './Notification';

const GlobalNotification = () => {
  const { commonStore: { notification, setNotification } } = useStore();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => history.listen(() => {
    setNotification(null);
  }), [history]);

  if (notification && notification.message
    && (location.pathname.startsWith('/psychologue') || !notification.displayOnlyOnPsyPages)) {
    return <Notification {...notification} onClose={() => setNotification(null)} />;
  }

  return <></>;
};

export default observer(GlobalNotification);
