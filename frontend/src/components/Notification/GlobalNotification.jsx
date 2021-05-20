import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';

import Notification from './Notification';

const GlobalNotification = () => {
  const { commonStore: { notification, setNotification } } = useStore();
  const history = useHistory();

  useEffect(() => history.listen(() => {
    setNotification(null);
  }), [history]);

  if (notification && notification.message) {
    return <Notification {...notification} onClose={() => setNotification(null)} />;
  }

  return <></>;
};

export default observer(GlobalNotification);
