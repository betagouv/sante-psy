import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './studentCards.cssmodule.scss';
import StudentCard from './StudentCard';

const StudentCards = () => (
  <Row className={styles.card}>
    <StudentCard
      index={1}
      title="Consultez un médecin généraliste"
      image="doctor"
      description={(
        <>
          pour établir votre
          {' '}
          <b>lettre d&lsquo;orientation*</b>
        </>
      )}
      hint="* ordonnance donnant droit au suivi psychologique"
    />
    <StudentCard
      index={2}
      big
      title="Choisissez un psychologue"
      image="psychologist"
      buttonText="Choisir un psychologue"
      buttonLink="/trouver-un-psychologue"
    />
    <StudentCard
      index={3}
      title="Bénéficiez de vos 8 séances gratuites"
      image="followup"
      description={(
        <>
          <b>sans avance de frais</b>
          {' '}
          de votre part
        </>
)}
    />
  </Row>
);

export default StudentCards;
