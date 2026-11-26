import React from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';
import styles from './univSection.cssmodule.scss';

const UnivContact = ({ university }) => {
  const checkIsEmpty = (value) => (value?.trim() ? value : '-');

  const fullAddress = university
    ? `${checkIsEmpty(university.address)}, ${checkIsEmpty(university.postal_code)} ${checkIsEmpty(university.city)}`
    : '-';

  const renderEmailIcon = (label, emailListRaw) => {
    const emails =
      emailListRaw
        ?.split(',')
        .map((email) => email.trim())
        .filter(Boolean) || [];
    const emailDisplay = emails.length ? emails.join(', ') : '-';
    const mailto = emails.length ? `mailto:${emails.join(',')}` : null;

    return (
      <section className={styles.emailRow}>
        <div className={styles.emailText}>
          <b>
            {label}
            &nbsp;:
          </b>
          &nbsp;
          <span>{emailDisplay}</span>
        </div>
        {mailto && (
          <Button
            priority="tertiary"
            size="medium"
            iconId="fr-icon-mail-line"
            linkProps={{
              to: mailto,
            }}
            title={`Envoyer un email à ${emails}`}
          />
        )}
      </section>
    );
  };

  return (
    <section className={styles.univBillingCard}>
      {university ? (
        <div>
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
