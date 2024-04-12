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
      title="Consultez un médecin généraliste"
      image="doctor"
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
      big
      title="Choisissez un psychologue"
      image="followup"
      buttonIcon="ri-search-line"
      buttonText="Trouver un psychologue"
      buttonLink="/trouver-un-psychologue"
    />
  </Row>
);

export default StudentCards;
