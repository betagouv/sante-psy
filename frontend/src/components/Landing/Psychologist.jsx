import React from 'react';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';
import styles from './psychologist.cssmodule.scss';

const Psychologist = () => {
  const { commonStore: { config } } = useStore();
  return (
    <div className={styles.container}>
      <div className={styles.description}>
        <div>Vous êtes psychologue ?</div>
        <div>
          Vous souhaitez participer au programme
          d&lsquo;accompagnement psychologique
          des étudiants ? Merci !
        </div>
      </div>
      <a
        className="fr-btn fr-btn--lg"
        href={config.demarchesSimplifieesUrl}
        target="_blank"
        rel="noreferrer"
      >
        Commencer mon inscription
      </a>
    </div>
  );
};

export default observer(Psychologist);
