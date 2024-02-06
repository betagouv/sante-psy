import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './studentCards.cssmodule.scss';
import StudentCard from './StudentCard';

const StudentCards = () => (
  <Row className={styles.card}>
    <StudentCard
      index={1}
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
    />
    <StudentCard
      index={2}
      big
      title="Choisissez un psychologue"
      image="psychologist"
      buttonIcon="ri-search-line"
      buttonText="Trouver un psychologue"
      buttonLink="/trouver-un-psychologue"
    />
    <StudentCard
      index={3}
      big
      title="Bénéficiez de vos 8 séances gratuites"
      image="followup"
      description={(
        <>
          <b>sans avance de frais</b>
          {' '}
          de votre part
        </>
)}
      buttonIcon="ri-information-line"
      buttonText="Foire aux questions"
      buttonLink="/faq"
    />
  </Row>
);

export default StudentCards;
