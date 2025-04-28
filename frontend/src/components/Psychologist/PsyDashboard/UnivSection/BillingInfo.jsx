import React from 'react';
import styles from './univSection.cssmodule.scss';

const UnivContact = ({ university }) => {
  const checkIsEmpty = value => (value?.trim() ? value : '-');

  return (
    <section className={styles.psyDashboardCard}>
      {university ? (
        <div>
          <h2>Contact universitaire</h2>
          <p><b>{`Université ${checkIsEmpty(university.name)}`}</b></p>
          <p>{checkIsEmpty(university.address)}</p>
          <p>
            <b>Facturation :</b>
            {' '}
            {checkIsEmpty(university.billingEmail)}
          </p>
          <p>
            <b>Convention :</b>
            {' '}
            {checkIsEmpty(university.emailSSU)}
          </p>
        </div>
      ) : (
        <div>
          <p>Vous n&apos;êtes rattaché à aucune université</p>
        </div>
      )}
    </section>
  );
};

export default UnivContact;
