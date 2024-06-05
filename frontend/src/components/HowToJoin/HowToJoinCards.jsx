import React from 'react';
import { Row } from '@dataesr/react-dsfr';

import styles from './howToJoinCards.cssmodule.scss';
import Card from '../Landing/Card';

const HowToJoinCards = () => (
  <Row className={styles.card}>
    <Card
      title={<>Je suis <b>étudiant</b></>}
      image="psychologist.svg"
      buttonText="Toutes les étapes"
      buttonLink="/rejoindre/etudiant"
      buttonSecondary
    />
    <Card
      title={<>Je suis <b>psychologue</b></>}
      image="followup.svg"
      buttonText="Conditions / inscription"
      buttonLink="/rejoindre/psychologue"
      buttonSecondary
    />
    <Card
      title={<>Je suis médecin ou je fais partie d’un SSU</>}
      image="doctor.svg"
      buttonText="Conditions / inscription"
      buttonLink="/rejoindre/medecin"
      buttonSecondary
    />
  </Row>
);

export default HowToJoinCards;
