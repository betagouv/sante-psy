/* eslint-disable no-bitwise */
import React from 'react';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';
import classNames from 'classnames';
import styles from './publicAnnouncement.cssmodule.scss';

const PublicAnnouncement = () => {
  const { commonStore: { config } } = useStore();

  const shouldDisplayAnnouncement = () => {
    if (config.publicAnnouncement) {
      return true;
    }
    return false;
  };

  return shouldDisplayAnnouncement() ? (
    <div className={classNames('container', styles.announcementContainer)}>
      <div className={styles.announcementContent}>{config.publicAnnouncement}</div>
    </div>
  ) : (
    null
  );
};

export default observer(PublicAnnouncement);
