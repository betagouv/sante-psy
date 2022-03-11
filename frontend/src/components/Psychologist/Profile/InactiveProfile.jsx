import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextInput, RadioGroup, Radio, Button, Alert, ButtonGroup } from '@dataesr/react-dsfr';
import agent from 'services/agent';
import Page from 'components/Page/Page';

const InactiveProfile = () => {
  const [reason, setReason] = useState();
  const [displayReason, setDisplayReason] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [done, setDone] = useState(false);
  const { token } = useParams();

  const getReason = () => (reason === 'other' ? `Autre: ${otherReason}` : reason);

  const selectReason = value => {
    if (value !== 'other') {
      setDisplayReason(false);
      setReason(value);
    }
  };
  const canValidate = reason
    && (reason !== 'other' || otherReason.trim() !== '');

  return (
    <Page
      title="Merci"
      background="blue"
    >
      {done ? (
        <Alert
          className="fr-mb-2w"
          type="success"
          {...done}
        />
      ) : (
        <>
          <RadioGroup
            legend="Vous nous avez indiqué vouloir quitter le dispositif Santé Psy Etudiant.
            Afin d’améliorer ce dernier, pouvez-vous nous indiquer la raison de ce choix :"
            ariaLabel="raison"
            name="reason"
            value={reason}
            onChange={selectReason}
          >
            <Radio
              data-test-id="radio-reason-toomuch"
              label="Je ne reçois pas assez de demandes"
              value="toofew"
            />
            <Radio
              data-test-id="radio-reason-toomuch"
              label="Je reçois trop de demandes"
              value="toomuch"
            />
            <Radio
              data-test-id="radio-reason-toomuch"
              label="Je n'arrive pas à me connecter"
              value="connection"
            />
            <Radio
              data-test-id="radio-reason-toomuch"
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
          <ButtonGroup isInlineFrom="xs">
            <Button
              data-test-id="suspend-button"
              icon="fr-fi-eye-off-line"
              onClick={() => {
                agent.Psychologist.inactive(getReason(), token)
                  .then(() => {
                    setDone({
                      title: "Vos informations ne sont plus visibles sur l'annuaire",
                      description: 'Vous pouvez redevenir visible à tout moment depuis votre espace psychologue dans la rubrique Mes informations',
                    });
                    window.scrollTo(0, 0);
                  })
                  .catch(() => window.scrollTo(0, 0));
              }}
              disabled={!canValidate}
            >
              Quitter le dispositif
            </Button>
            <Button
              icon="fr-fi-eye-line"
              secondary
              onClick={() => {
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
              }}
            >
              Non, je veux rester
            </Button>
          </ButtonGroup>
        </>
      )}
    </Page>
  );
};

export default InactiveProfile;
