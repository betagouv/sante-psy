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

  const getReason = () => (reason === 'other' ? `other: ${otherReason}` : reason);

  const selectReason = e => {
    setDisplayReason(false);
    setReason(e.target.value);
  };

  const selectDuration = e => {
    setDisplayDate(false);
    setDuration(e.target.value);
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
        current="Suspendre mon compte"
      />
      <h1>Suspendre mon compte</h1>
      <GlobalNotification />
      <p>
        Cette action vous retirera de l&lsquo;annuaire afin de ne plus être contacté par des étudiants.
        Elle n&lsquo;influe en rien vos remboursements en cours et vous pourrez toujours déclarer vos séances.
        Vous pourez reactiver votre compte à tout moment.
      </p>
      <RadioGroup
        legend="Pourquoi voulez vous suspendre votre compte ?"
        ariaLabel="raisons de suspensions"
        name="reason"
      >
        <Radio
          label="Je pars en vacances"
          onChange={selectReason}
          value="holidays"
        />
        <Radio
          label="Je reçois trop de demandes"
          onChange={selectReason}
          value="toomuch"
        />
        <Radio
          label="Je suis en attente de mes remboursements"
          onChange={selectReason}
          value="reimbursments"
        />
        <Radio
          label="Je suis en attente de ma convention"
          onChange={selectReason}
          value="convention"
        />
        <Row className="fr-radio-group">
          <Col n="sm-2">
            <Radio
              label="Autre"
              onChange={e => {
                setReason('other');
                setDisplayReason(e.target.checked);
              }}
              value="other"
            />
          </Col>
          {displayReason && (
            <Col>
              <TextInput
                required
                value={otherReason}
                onChange={e => setOtherReason(e.target.value)}
              />
            </Col>
          )}
        </Row>
      </RadioGroup>
      <RadioGroup
        legend="Pour combien de temps voulez vous suspendre votre compte ?"
        ariaLabel="durée de la suspension"
      >
        <Radio
          label="1 semaine"
          onChange={selectDuration}
          value="week"
        />
        <Radio
          label="1 mois"
          onChange={selectDuration}
          value="month"
        />
        <Row className="fr-radio-group">
          <Col n="sm-2">
            <Radio
              label="Autre"
              onChange={e => {
                setDuration('other');
                setDisplayDate(e.target.checked);
              }}
              value="other"
            />
          </Col>
          {displayDate && (
            <Col>
              <DatePicker
                selected={date}
                minDate={tomorrow}
                dateFormat="dd/MM/yyyy"
                customInput={<DateInput />}
                onChange={newDate => setDate(convertLocalToUTCDate(newDate))}
              />
            </Col>
          )}

        </Row>
        <Radio
          label="Je souhaite suspendre mon compte définitivement"
          onChange={selectDuration}
          value="forever"
        />
      </RadioGroup>
      <Button
        icon="fr-fi-delete-line"
        title="delete"
        onClick={() => suspendPsychologist(getReason(), calculateSuspensionDate())}
        disabled={!canValidate}
      >
        Suspendre mon compte
      </Button>
    </>
  );
};

export default SuspendProfile;
