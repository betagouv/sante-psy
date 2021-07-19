import React from 'react';
import { HashLink } from 'react-router-hash-link';

import styles from './faq.cssmodule.scss';

const Faq = () => (
  <div className={styles.container}>
    <div className={styles.description}>
      <div>Vous avez une question ?</div>
      <div>
        Retrouvez les réponses aux questions les plus fréquemment posées.
      </div>
    </div>
    <HashLink
      className="fr-btn fr-btn--lg fr-btn--secondary"
      to="/faq"
    >
      Consulter la foire aux questions
    </HashLink>
  </div>
);

export default Faq;
