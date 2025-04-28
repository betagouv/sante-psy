import React from 'react';
import { Button } from '@dataesr/react-dsfr';
import styles from './univSection.cssmodule.scss';

const UnivContact = ({ university }) => {
  const checkIsEmpty = value => (value?.trim() ? value : '-');

  const fullAddress = university
    ? `${checkIsEmpty(university.address)}, ${checkIsEmpty(university.postal_code)} ${checkIsEmpty(university.city)}`
    : '-';

  const renderEmailIcon = (label, emailListRaw) => {
    const emails = emailListRaw?.split(',').map(email => email.trim()).filter(Boolean) || [];
    const emailDisplay = emails.length ? emails.join(', ') : '-';
    const mailto = emails.length ? `mailto:${emails.join(',')}` : null;

    return (
      <p className={styles.emailGroup}>
        <b>
          {label}
          {' '}
          :
        </b>
        {' '}
        {emailDisplay}
        {mailto && (
          <Button
            tertiary
            size="lg"
            icon="ri-mail-line"
            className={styles.button}
            title={`Envoyer un mail au service de ${label.toLowerCase()}`}
            onClick={() => { window.location.href = mailto; }}
          />
        )}
      </p>
    );
  };

  return (
    <section className={styles.psyDashboardCard}>
      {university ? (
        <div className={styles.psyDashboardCardContent}>
          <h2>Contact universitaire</h2>
          <b>{`Université ${checkIsEmpty(university.name)}`}</b>
          <p>{fullAddress}</p>
          {renderEmailIcon('Facturation', university.billingEmail)}
          {renderEmailIcon('Convention', university.emailSSU)}
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
