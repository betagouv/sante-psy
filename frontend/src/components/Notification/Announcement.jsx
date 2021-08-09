/* eslint-disable no-bitwise */
import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { useStore } from 'stores/';

import Notification from './Notification';

import styles from './announcement.cssmodule.scss';

const Announcement = () => {
  const { commonStore: { config } } = useStore();

  // Code from https://stackoverflow.com/a/7616484
  function hashCode(str) {
    if (!str) {
      return 0;
    }

    let hash = 0; let i; let
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  const shouldDisplayAnnouncement = () => {
    if (config.announcement) {
      const hiddenAnnouncement = window.localStorage.getItem('hiddenAnnouncement');
      if (hiddenAnnouncement && hashCode(config.announcement).toString() === hiddenAnnouncement) {
        return false;
      }
      return true;
    }
    return false;
  };

  const onClose = () => {
    window.localStorage.setItem('hiddenAnnouncement', hashCode(config.announcement));
  };

  return shouldDisplayAnnouncement() ? (
    <div className={classnames('fr-container', { [styles.notification]: true })}>
      <Notification message={config.announcement} onClose={onClose} type="info" />
    </div>
  ) : (
    <></>
  );
};

export default observer(Announcement);
