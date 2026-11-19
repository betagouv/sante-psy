import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons';
import agent from 'services/agent';
import Page from 'components/Page/Page';

const InactiveProfile = () => {
  const [reason, setReason] = useState();
  const [displayReason, setDisplayReason] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [done, setDone] = useState(false);
  const { token } = useParams();

  const getReason = () =>
    reason === 'other' ? `Autre: ${otherReason}` : reason;

  const selectReason = (value) => {
    if (value !== 'other') {
      setDisplayReason(false);
      setReason(value);
    }
  };
  const canValidate =
    reason && (reason !== 'other' || otherReason.trim() !== '');

  return (
    <Page title="Merci">
      {done ? (
        <Alert className="fr-mb-2w" severity="success" {...done} />
      ) : (
        <>
          <RadioButtons
            legend={`Vous nous avez indiqué vouloir quitter le dispositif Santé Psy Etudiant.
Afin d’améliorer ce dernier, pouvez-vous nous indiquer la raison de ce choix :`}
            name="reason"
            options={[
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
          <ButtonsGroup
            inlineLayoutWhen="always"
            buttons={[
              {
                children: 'Quitter le dispositif',
                iconId: 'fr-icon-eye-off-line',
                iconPosition: 'left',
                nativeButtonProps: {
                  'data-test-id': 'suspend-button',
                  disabled: !canValidate,
                },
                onClick: () => {
                  agent.Psychologist.inactive(getReason(), token)
                    .then(() => {
                      setDone({
                        title:
                          "Vos informations ne sont plus visibles sur l'annuaire",
                        description:
                          'Vous pouvez redevenir visible à tout moment depuis votre espace psychologue dans la rubrique Mes informations',
                      });
                      window.scrollTo(0, 0);
                    })
                    .catch(() => window.scrollTo(0, 0));
                },
              },
              {
                children: 'Non, je veux rester',
                priority: 'secondary',
                iconId: 'fr-icon-eye-line',
                iconPosition: 'left',
                onClick: () => {
                  agent.Psychologist.active(token)
                    .then(() => {
                      setDone({
                        title: 'Merci',
                        description:
                          'Nous avons bien pris en compte votre réponse et vous remercions pour votre investissement !',
                      });
                      window.scrollTo(0, 0);
                    })
                    .catch(() => window.scrollTo(0, 0));
                },
              },
            ]}
          />
        </>
      )}
    </Page>
  );
};

export default InactiveProfile;
