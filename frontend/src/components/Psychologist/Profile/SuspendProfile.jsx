import React, { useState } from 'react';
import { TextInput, RadioGroup, Radio, Button, Row, Col } from '@dataesr/react-dsfr';
import DatePicker from 'react-datepicker';

import Ariane from 'components/Ariane/Ariane';
import GlobalNotification from 'components/Notification/GlobalNotification';
import DateInput from 'components/Date/DateInput';

import { convertLocalToUTCDate } from 'services/date';

const SuspendProfile = ({ suspendPsychologist }) => {
  const [reason, setReason] = useState();
  const [duration, setDuration] = useState();
  const [displayDate, setDisplayDate] = useState(false);
  const [displayReason, setDisplayReason] = useState(false);
  const [date, setDate] = useState();
  const [otherReason, setOtherReason] = useState('');

  const calculateSuspensionDate = () => {
    const currentDate = new Date();
    switch (duration) {
      case 'week':
        currentDate.setDate(currentDate.getDate() + 7);
        return currentDate;
      case 'month':
        currentDate.setMonth(currentDate.getMonth() + 1);
        return currentDate;
      case 'forever':
        return new Date('9999-12-31');
      case 'other':
        return date;
      default:
        return undefined;
    }
  };

  const getReason = () => (reason === 'other' ? `Autre: ${otherReason}` : reason);

  const selectReason = value => {
    if (value !== 'other') {
      setDisplayReason(false);
      setReason(value);
    }
  };

  const selectDuration = value => {
    if (value !== 'other') {
      setDisplayDate(false);
      setDuration(value);
    }
  };

  const canValidate = reason
  && duration
  && (reason !== 'other' || otherReason.trim() !== '')
  && (duration !== 'other' || date);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <>
      <Ariane
        previous={[
          {
            label: 'Mes informations',
            url: '/psychologue/mon-profil',
          }]}
        current="Retirer mes informations de l'annuaire"
      />
      <h1>Retirer mes informations de l&lsquo;annuaire</h1>
      <GlobalNotification />
      <p>
        Cette action vous retirera temporairement de l&lsquo;annuaire afin de ne plus être contacté par des étudiants.
        Elle n&lsquo;influe en rien vos remboursements en cours et vous pourrez toujours déclarer vos séances.
        Vous pourrez reactiver votre compte à tout moment.
      </p>
      <RadioGroup
        legend="Pourquoi voulez vous retirer vos informations ?"
        ariaLabel="raison"
        name="reason"
        value={reason}
        onChange={selectReason}
      >
        <Radio
          data-test-id="radio-reason-holidays"
          label="Je pars en vacances"
          value="holidays"
        />
        <Radio
          data-test-id="radio-reason-toomuch"
          label="Je reçois trop de demandes"
          value="toomuch"
        />
        <Radio
          data-test-id="radio-reason-reimbursments"
          label="Je suis en attente de mes remboursements"
          value="reimbursments"
        />
        <Radio
          data-test-id="radio-reason-convention"
          label="Je suis en attente de ma convention"
          value="convention"
        />
        <Radio
          data-test-id="radio-reason-other"
          label="Autre"
          onChange={e => {
            setReason('other');
            setDisplayReason(e.target.checked);
          }}
          value="other"
        />
        {displayReason && (
          <TextInput
            data-test-id="radio-reason-other-input"
            required
            value={otherReason}
            onChange={e => setOtherReason(e.target.value)}
            textarea
          />
        )}
      </RadioGroup>
      <RadioGroup
        legend="Pour combien de temps voulez vous retirer vos informations ?"
        ariaLabel="durée"
        value={duration}
        onChange={selectDuration}
      >
        <Radio
          data-test-id="radio-duration-week"
          label="1 semaine"
          value="week"
        />
        <Radio
          data-test-id="radio-duration-month"
          label="1 mois"
          value="month"
        />
        <Radio
          data-test-id="radio-duration-forever"
          label="Je souhaite retirer mes informations définitivement"
          value="forever"
        />
        <Radio
          data-test-id="radio-duration-other"
          label="Autre"
          onChange={e => {
            setDuration('other');
            setDisplayDate(e.target.checked);
          }}
          value="other"
        />
        {displayDate && (
          <DatePicker
            selected={date}
            minDate={tomorrow}
            dateFormat="dd/MM/yyyy"
            customInput={(
              <DateInput
                dataTestId="radio-duration-other-input"
              />
                )}
            onChange={newDate => setDate(convertLocalToUTCDate(newDate))}
          />
        )}
      </RadioGroup>
      <Button
        data-test-id="suspend-button"
        icon="fr-fi-eye-off-line"
        title="delete"
        onClick={() => suspendPsychologist(getReason(), calculateSuspensionDate())}
        disabled={!canValidate}
      >
        Retirer mes informations de l&lsquo;annuaire
      </Button>
    </>
  );
};

export default SuspendProfile;
