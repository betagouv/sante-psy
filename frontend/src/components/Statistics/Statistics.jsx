import React from 'react';
import MetabaseAppEmbed from './MetabaseAppEmbed';

import styles from './statistics.cssmodule.scss';

const Statistics = () => (
  <MetabaseAppEmbed
    className={styles.iframe}
    title="stats"
    base="https://stats.santepsyetudiant.beta.gouv.fr"
    path="/public/dashboard/efcb7427-c80a-4f67-b0b1-7ff04f8a255b"
  />
);

export default Statistics;
