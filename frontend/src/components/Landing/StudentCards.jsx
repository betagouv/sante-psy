import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './studentCards.cssmodule.scss';
import StudentCard from './StudentCard';

const StudentCards = () => (
  <Row className={styles.card}>
    <StudentCard
      index={1}
      big
      title="Vérifier votre éligibilité"
      image="psychologist"
      buttonIcon="ri-user-search-fill"
      buttonText="Vérifiez votre éligibilité"
      buttonLink="/eligibilite"
    />
    <StudentCard
      index={2}
      big
      title="Choisissez un psychologue"
      image="followup"
      buttonIcon="ri-search-line"
      buttonText="Trouver un psychologue"
      buttonLink="/trouver-un-psychologue"
      anchor="anchor-psy-list"
    />
  </Row>
);

export default StudentCards;
