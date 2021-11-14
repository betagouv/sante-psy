import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './studentCards.cssmodule.scss';
import StudentCard from './StudentCard';

const StudentCards = () => (
  <Row className={styles.card}>
    <StudentCard
      index={1}
      title="Je consulte un médecin"
      image="doctor"
      description="Votre médecin généraliste ou votre Service de Santé Universitaire vous oriente vers un accompagnement psychologique."
    />
    <StudentCard
      index={2}
      title="Je choisis un psychologue"
      image="psychologist"
      description="Vous choisissez le professionnel qui vous accompagnera parmi la liste des psychologues partenaires."
    />
    <StudentCard
      index={3}
      title="Je bénéficie d'un suivi"
      image="followup"
      description="Prenez rendez-vous et bénéficiez jusqu'à 8 séances gratuites."
    />
  </Row>
);

export default StudentCards;
