import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './studentCards.cssmodule.scss';
import StudentCard from './StudentCard';

const StudentCards = () => (
  <Row className={styles.card}>
    <StudentCard
      index={1}
      cardSize='lg'
      titleSize='lg'
      title={<b>Vérifier votre éligibilité</b>}
      image="psychologist.svg"
      buttonIcon="ri-user-search-fill"
      buttonText="Vérifiez votre éligibilité"
      buttonLink="/eligibilite"
    />
    <StudentCard
      index={2}
      cardSize='lg'
      titleSize='lg'
      title={<b>Consultez un médecin généraliste</b>}
      image="doctor.svg"
      description={(
        <>
          pour établir une
          {' '}
          <b>lettre d&lsquo;orientation</b>
        </>
      )}
      buttonIcon="ri-calendar-todo-line"
      buttonText="Prendre rendez-vous"
      buttonLink="https://www.doctolib.fr"
      hint="ou un Service de santé étudiante"
      anchor="anchor-prescription-letter"
    />
    <StudentCard
      index={3}
      cardSize='lg'
      titleSize='lg'
      title={<b>Choisissez un psychologue</b>}
      image="followup.svg"
      buttonIcon="ri-search-line"
      buttonText="Trouver un psychologue"
      buttonLink="/trouver-un-psychologue"
    />
  </Row>
);

export default StudentCards;
