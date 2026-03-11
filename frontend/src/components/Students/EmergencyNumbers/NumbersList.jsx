import React from 'react';
import styles from './emergencyNumbers.cssmodule.scss';

const NumbersItems = ({ title, subtitle, description, number, colorClass }) => (
  <li className={styles.numberItems}>
    <div className={styles.numberHeader}>
      <span className={`fr-icon-phone-line ${styles.phoneBadge} ${colorClass}`} aria-hidden="true" />
      <div className={styles.numberInfo}>
        <strong className={styles.numberTitle}>{title}</strong>
        <p className={styles.numberSubtitle}>{subtitle}</p>
      </div>
      <a
        href={`tel:${number.replace(/\s/g, '')}`}
        className={`${styles.phoneNumber} ${colorClass}`}
        aria-label={`Appeler le ${number}`}
      >
        {number}
      </a>
    </div>
    {description && <p>{description}</p>}
  </li>
);

export default NumbersItems;
