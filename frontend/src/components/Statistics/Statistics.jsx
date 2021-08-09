import React from 'react';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';

import MetabaseAppEmbed from './MetabaseAppEmbed';

import styles from './statistics.cssmodule.scss';

const Statistics = () => {
  const { commonStore: { config } } = useStore();
  if (!config.statistics) {
    return <></>;
  }

  return (
    <MetabaseAppEmbed
      className={styles.iframe}
      title="stats"
      base={config.statistics.base}
      path={config.statistics.dashboard}
    />
  );
};

export default observer(Statistics);
