import React, { useState } from 'react';
import { TextInput, RadioGroup, Radio, Button, ButtonGroup } from '@dataesr/react-dsfr';
import DatePicker from 'react-datepicker';

import DateInput from 'components/Date/DateInput';

import { convertLocalToUTCDate } from 'services/date';

const SuspendProfile = ({ suspendPsychologist, cancelSuspension }) => {
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
          data-test-id="radio-reason-toofew"
          label="Je ne reçois pas assez de demandes"
          value="toofew"
        />
        <Radio
          data-test-id="radio-reason-toomuch"
          label="Je reçois trop de demandes"
          value="toomuch"
        />
        <Radio
          data-test-id="radio-reason-connection"
          label="Je n'arrive pas à me connecter"
          value="connection"
        />
        <Radio
          data-test-id="radio-reason-disagree"
          label="Je ne suis plus en accord avec le dispositif"
          value="disagree"
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
      <ButtonGroup isInlineFrom="xs">
        <Button
          data-test-id="suspend-button"
          icon="fr-fi-eye-off-line"
          onClick={() => suspendPsychologist(getReason(), calculateSuspensionDate())}
          disabled={!canValidate}
        >
          Retirer mes informations de l&lsquo;annuaire
        </Button>
        <Button
          onClick={cancelSuspension}
          secondary
          icon="fr-fi-close-line"
        >
          Annuler
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SuspendProfile;
