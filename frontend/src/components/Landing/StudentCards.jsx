import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './studentCards.cssmodule.scss';
import StudentCard from './StudentCard';

const StudentCards = () => (
  <Row className={styles.card}>
    <StudentCard
      index={1}
      title="Consultez un médecin"
      image="doctor"
      description="Consultez un médecin généraliste pour établir votre lettre d’orientation"
    />
    <StudentCard
      index={2}
      title="Choisissez un psychologue"
      image="psychologist"
      description="Choisissez dans la liste des psychologues partenaires celui ou celle qui vous convient"
    />
    <StudentCard
      index={3}
      title="Bénéficiez d’un suivi"
      image="followup"
      description="Prenez rendez-vous et bénéficiez jusqu’à 8 séances gratuites"
    />
  </Row>
);

export default StudentCards;
