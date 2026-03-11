import React from 'react';
import { Link } from 'react-router-dom';
import styles from './emergencyNumbers.cssmodule.scss';
import NumbersItems from './NumbersList';

const numbers = [
  {
    title: 'Urgences',
    subtitle: 'Samu 24h/24',
    number: '15',
    colorClass: styles.badgeBlue,
  },
  {
    title: '3114',
    subtitle: 'Numéro national de prévention du suicide',
    number: '3114',
    colorClass: styles.badgePurple,
  },
  {
    title: 'CNAÉ',
    subtitle: '10h–21h en semaine · 10h–14h en week-end',
    description: "Ligne d'écoute professionnelle d'accompagnement et de signalement (situations de mal-être, violence, discrimination)",
    number: '0 800 737 800',
    colorClass: styles.badgeNavy,
  },
];

const EmergencyNumbers = () => (
  <main className={styles.page}>
    <div className={styles.bearCard}>
      <img
        src="/images/studentSpace/emergencyNumbersBear.png"
        alt="Un ours violet sympathique avec des outils médicaux et des livres"
        className={styles.bearImg}
      />
      <p className={styles.bearText}>Ta santé mentale compte.</p>
      <p className={styles.bearText}>
        Si tu traverses une période difficile, n&apos;hésite jamais à appeler si tu en ressens le besoin.
      </p>
    </div>
    <div className={styles.ctaRow}>
      <Link
        to="/trouver-un-psychologue"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaBtn}
      >
        Prendre RDV avec un psychologue
      </Link>
    </div>
    <ul className={styles.numbersList}>
      {numbers.map(item => (
        <NumbersItems key={item.number} {...item} />
      ))}
    </ul>

    <div className={styles.supportRow}>
      <Link
        to="/contact/formulaire"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contacter le support
      </Link>
    </div>

  </main>
);

export default EmergencyNumbers;
