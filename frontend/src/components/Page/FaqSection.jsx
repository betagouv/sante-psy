import React from 'react';

import { HashLink } from 'react-router-hash-link';
import { Container } from '@dataesr/react-dsfr';

import styles from './faqsection.cssmodule.scss';

const FaqSection = () => (
  <Container
    spacing="py-4w"
    className={styles.container}
  >
    <div className={styles.text}>
      <div className={styles.title}>Vous avez une question ?</div>
      <div className={styles.description}>
        Retrouvez les réponses aux questions les plus fréquemment posées.
      </div>
    </div>
    <HashLink
      className="fr-btn fr-btn--lg fr-btn--secondary"
      to="/faq"
    >
      Consulter la foire aux questions
    </HashLink>
  </Container>
);

export default FaqSection;
