import React from 'react';
import { Row } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import styles from './cards.cssmodule.scss';

const cards = [
  { imgSrc: '/images/contact/student.png', text: 'Je suis étudiant', section: 'etudiant' },
  { imgSrc: '/images/contact/psychologist.png', text: 'Je suis psychologue', section: 'psychologue' },
  { imgSrc: '/images/contact/university.png', text: 'Je suis une école', section: 'ecole' },
];

const ContactCards = () => {
  const navigate = useNavigate();

  return (
    <Row className={styles.cardContainer}>
      {cards.map(card => (
        <div
          className={styles.card}
          onClick={() => navigate(`/faq?section=${card.section}`)}
        >
          <img src={card.imgSrc} alt={card.text} />
          <p>{card.text}</p>
        </div>
      ))}
    </Row>
  );
};

export default ContactCards;
