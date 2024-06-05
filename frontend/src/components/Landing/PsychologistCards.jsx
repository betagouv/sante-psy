import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './psychologistCards.cssmodule.scss';
import Card from './Card';

const StudentCards = () => (
  <Row className={styles.card}>
    <Card
      title={<><b>Médecins,</b><br/> services de santé</>}
      image="hospital.png"
      buttonText="Comment orienter les étudiants ?"
      buttonLink="/eligibilite"
      buttonSecondary
    />
    <Card
      title={<><b>Témoignages</b> de psychologues partenaires</>}
      image="doctor.svg"
      buttonText="Témoignages"
      buttonLink="https://www.doctolib.fr"
      buttonSecondary
    />
    <Card
      title={<><b>Psychologues,</b> rejoignez le dispositif</>}
      image="followup.svg"
      buttonText="Conditions / inscription"
      buttonLink="/trouver-un-psychologue"
      buttonSecondary
    />
  </Row>
);

export default StudentCards;
