import React, { useState } from 'react';
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import DatePicker from 'react-datepicker';
import agent from 'services/agent';

import DateInput from 'components/Date/DateInput';

import { convertLocalToUTCDate } from 'services/date';
import { useStore } from 'stores/index';
import { useNavigate } from 'react-router-dom';

const SuspendProfile = () => {
  const {
    commonStore: { setPsychologists },
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
      .then((response) => {
        updatePsyList();
        navigate('/psychologue/tableau-de-bord', {
          state: { notification: response },
        });
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const activatePsychologist = () => {
    agent.Psychologist.activate()
      .then((response) => {
        updatePsyList();
        navigate('/psychologue/tableau-de-bord', {
          state: { notification: response },
        });
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const cancelSuspension = () => {
    navigate('/psychologue/tableau-de-bord');
  };

  const updatePsyList = () => {
    agent.Psychologist.find().then(setPsychologists);
  };

  const getReason = () =>
    reason === 'other' ? `Autre: ${otherReason}` : reason;

  const selectReason = (value) => {
    if (value !== 'other') {
      setDisplayReason(false);
      setReason(value);
    }
  };

  const canValidate =
    reason &&
    duration &&
    (reason !== 'other' || otherReason.trim() !== '') &&
    (duration !== 'other' || date !== undefined);

  const selectDuration = (value) => {
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
          <RadioButtons
            legend="Pourquoi voulez vous retirer vos informations ?"
            name="reason"
            options={[
              {
                label: 'Je pars en vacances',
                nativeInputProps: {
                  value: 'holidays',
                  checked: reason === 'holidays',
                  onChange: (e) => selectReason(e.target.value),
                  'data-test-id': 'radio-reason-holidays',
                },
              },
              {
                label: 'Je ne reçois pas assez de demandes',
                nativeInputProps: {
                  value: 'toofew',
                  checked: reason === 'toofew',
                  onChange: (e) => selectReason(e.target.value),
                  'data-test-id': 'radio-reason-toofew',
                },
              },
              {
                label: 'Je reçois trop de demandes',
                nativeInputProps: {
                  value: 'toomuch',
                  checked: reason === 'toomuch',
                  onChange: (e) => selectReason(e.target.value),
                  'data-test-id': 'radio-reason-toomuch',
                },
              },
              {
                label: "Je n'arrive pas à me connecter",
                nativeInputProps: {
                  value: 'connection',
                  checked: reason === 'connection',
                  onChange: (e) => selectReason(e.target.value),
                  'data-test-id': 'radio-reason-connection',
                },
              },
              {
                label: 'Je ne suis plus en accord avec le dispositif',
                nativeInputProps: {
                  value: 'disagree',
                  checked: reason === 'disagree',
                  onChange: (e) => selectReason(e.target.value),
                  'data-test-id': 'radio-reason-disagree',
                },
              },
              {
                label: 'Je suis en attente de mes remboursements',
                nativeInputProps: {
                  value: 'reimbursments',
                  checked: reason === 'reimbursments',
                  onChange: (e) => selectReason(e.target.value),
                  'data-test-id': 'radio-reason-reimbursments',
                },
              },
              {
                label: 'Je suis en attente de ma convention',
                nativeInputProps: {
                  value: 'convention',
                  checked: reason === 'convention',
                  onChange: (e) => selectReason(e.target.value),
                  'data-test-id': 'radio-reason-convention',
                },
              },
              {
                label: 'Autre',
                nativeInputProps: {
                  value: 'other',
                  checked: reason === 'other',
                  onChange: (e) => {
                    setReason('other');
                    setDisplayReason(e.target.checked);
                  },
                  'data-test-id': 'radio-reason-other',
                },
              },
            ]}
          />

          {displayReason && (
            <div className="fr-input-group">
              <textarea
                className="fr-input"
                data-test-id="radio-reason-other-input"
                required
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            </div>
          )}

          <RadioButtons
            legend="Pour combien de temps voulez vous retirer vos informations ?"
            name="duration"
            options={[
              {
                label: '1 semaine',
                nativeInputProps: {
                  value: 'week',
                  checked: duration === 'week',
                  onChange: (e) => selectDuration(e.target.value),
                  'data-test-id': 'radio-duration-week',
                },
              },
              {
                label: '1 mois',
                nativeInputProps: {
                  value: 'month',
                  checked: duration === 'month',
                  onChange: (e) => selectDuration(e.target.value),
                  'data-test-id': 'radio-duration-month',
                },
              },
              {
                label: 'Je souhaite retirer mes informations définitivement',
                nativeInputProps: {
                  value: 'forever',
                  checked: duration === 'forever',
                  onChange: (e) => selectDuration(e.target.value),
                  'data-test-id': 'radio-duration-forever',
                },
              },
              {
                label: 'Autre',
                nativeInputProps: {
                  value: 'other',
                  checked: duration === 'other',
                  onChange: (e) => {
                    setDuration('other');
                    setDisplayDate(e.target.checked);
                  },
                  'data-test-id': 'radio-duration-other',
                },
              },
            ]}
          />

          {displayDate && (
            <DatePicker
              selected={date}
              minDate={tomorrow}
              dateFormat="dd/MM/yyyy"
              customInput={
                <DateInput dataTestId="radio-duration-other-input" />
              }
              onChange={(newDate) => setDate(convertLocalToUTCDate(newDate))}
            />
          )}
        </>
      )}
      <ButtonsGroup
        inlineLayoutWhen="always"
        buttons={[
          {
            children: user.active
              ? "Retirer mes informations de l'annuaire"
              : "Remettre mes informations de l'annuaire",
            iconId: user.active ? 'fr-icon-eye-off-line' : 'fr-icon-eye-line',
            iconPosition: 'left',
            className: 'fr-mb-2w',
            nativeButtonProps: {
              'data-test-id': user.active
                ? 'suspend-redirection-button'
                : 'activate-button',
              disabled: user.active && !canValidate,
            },
            onClick: () =>
              user.active ? suspendPsychologist() : activatePsychologist(),
          },
          {
            children: 'Annuler',
            priority: 'secondary',
            iconId: 'fr-icon-close-line',
            iconPosition: 'left',
            onClick: cancelSuspension,
          },
        ]}
      />
    </>
  );
};

export default SuspendProfile;
