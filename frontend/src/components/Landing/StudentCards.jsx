import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import Card from 'components/Card/Card';
import styles from './studentCards.cssmodule.scss';

const StudentCards = () => (
  <Row className={styles.card}>
    <Card
      index={1}
      title="Vérifier votre éligibilité"
      image="eligibility/psychologist.svg"
      buttonIcon="ri-user-search-fill"
      buttonText="Vérifiez votre éligibilité"
      link="/eligibilite"
    />
    <Card
      index={2}
      title="Choisissez un psychologue"
      image="eligibility/followup.svg"
      buttonIcon="ri-search-line"
      buttonText="Trouver un psychologue"
      link="/trouver-un-psychologue"
      anchor="anchor-psy-list"
    />
  </Row>
);

export default StudentCards;
