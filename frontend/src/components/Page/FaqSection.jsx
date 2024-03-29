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
      <h3>Vous avez une question ?</h3>
      <div className="fr-text--lg">
        Retrouvez les réponses aux questions les plus fréquemment posées.
      </div>
    </div>
    <div className="button-secondary-container">
      <HashLink
        className="fr-btn fr-btn--lg fr-btn--secondary"
        to="/faq"
        id="faq-button"
      >
        Consulter la foire aux questions
      </HashLink>
    </div>
  </Container>
);

export default FaqSection;
