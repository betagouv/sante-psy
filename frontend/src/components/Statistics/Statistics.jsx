import React from 'react';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';

import MetabaseAppEmbed from './MetabaseAppEmbed';

import styles from './statistics.cssmodule.scss';

const Statistics = () => {
  const { commonStore: { config } } = useStore();
  if (!config.satistics) {
    return <></>;
  }

  return (
    <MetabaseAppEmbed
      className={styles.iframe}
      title="stats"
      base={config.satistics.base}
      path={config.satistics.dashboard}
    />
  );
};

export default observer(Statistics);
