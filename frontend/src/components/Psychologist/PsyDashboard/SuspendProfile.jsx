import React, { useState } from 'react';
import {
  TextInput,
  RadioGroup,
  Radio,
  Button,
  ButtonGroup,
} from '@dataesr/react-dsfr';
import DatePicker from 'react-datepicker';
import agent from 'services/agent';

import DateInput from 'components/Date/DateInput';

import { convertLocalToUTCDate } from 'services/date';
import { useStore } from 'stores/index';
import { useNavigate } from 'react-router-dom';

const SuspendProfile = () => {
  const {
    commonStore: { setNotification, setPsychologists },
    userStore: { user },
  } = useStore();
  const navigate = useNavigate();

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

  const suspendPsychologist = () => {
    agent.Psychologist.suspend(getReason(), calculateSuspensionDate())
      .then(response => {
        setNotification(response);
        updatePsyList();
        navigate('/psychologue/tableau-de-bord');
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const activatePsychologist = () => {
    agent.Psychologist.activate()
      .then(response => {
        setNotification(response);
        updatePsyList();
        navigate('/psychologue/tableau-de-bord');
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const cancelSuspension = () => {
    navigate('/psychologue/tableau-de-bord');
  };

  const updatePsyList = () => {
    agent.Psychologist.find().then(setPsychologists);
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <>
      <h3>Statut de mon compte</h3>
      {user.active && (
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
                customInput={
                  <DateInput dataTestId="radio-duration-other-input" />
                }
                onChange={newDate => setDate(convertLocalToUTCDate(newDate))}
              />
            )}
          </RadioGroup>
        </>
      )}
      <ButtonGroup isInlineFrom="xs">
        <Button
          id="hide-profil-button"
          data-test-id={
            user.active ? 'suspend-redirection-button' : 'activate-button'
          }
          icon={user.active ? 'fr-fi-eye-off-line' : 'fr-fi-eye-line'}
          className="fr-mb-2w"
          onClick={() => (user.active
            ? suspendPsychologist()
            : activatePsychologist())}
        >
          {user.active
            ? "Retirer mes informations de l'annuaire"
            : "Remettre mes informations de l'annuaire"}
        </Button>
        <Button onClick={cancelSuspension} secondary icon="fr-fi-close-line">
          Annuler
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SuspendProfile;
