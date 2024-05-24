import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './psychologistCards.cssmodule.scss';
import StudentCard from './StudentCard';

const StudentCards = () => (
  <Row className={styles.card}>
    <StudentCard
      title={<><b>Médecins,</b><br/> services de santé</>}
      image="hospital.png"
      buttonText="Comment orienter les étudiants ?"
      buttonLink="/eligibilite"
      buttonSecondary
    />
    <StudentCard
      title={<><b>Témoignages</b> de psychologues partenaires</>}
      image="doctor.svg"
      buttonText="Témoignages"
      buttonLink="https://www.doctolib.fr"
      buttonSecondary
    />
    <StudentCard
      title={<><b>Psychologues,</b> rejoignez le dispositif</>}
      image="followup.svg"
      buttonText="Conditions / inscription"
      buttonLink="/trouver-un-psychologue"
      buttonSecondary
    />
  </Row>
);

export default StudentCards;
