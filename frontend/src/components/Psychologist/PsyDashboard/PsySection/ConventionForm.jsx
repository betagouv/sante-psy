import React, { useEffect, useState } from 'react';
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons';
import { Button } from '@codegouvfr/react-dsfr/Button';

import agent from 'services/agent';
import { useStore } from 'stores/';
import { useNavigate } from 'react-router-dom';

const ConventionForm = ({
  onConventionUpdated = () => {},
  checkDefaultValue,
}) => {
  const [convention, setConvention] = useState();
  const navigate = useNavigate();

  const {
    commonStore: { setNotification },
    userStore: { setUser, user },
  } = useStore();

  useEffect(() => {
    setConvention({
      isConventionSigned: checkDefaultValue
        ? user.convention && user.convention.isConventionSigned === true
        : '',
    });
  }, [user.convention]);

  const saveConvention = (e) => {
    e.preventDefault();
    setNotification({});
    agent.Convention.save(convention).then((response) => {
      setUser({ convention: response.convention });
      onConventionUpdated();
      navigate('/psychologue/tableau-de-bord', {
        state: { notification: response },
      });
    });
  };
  return (
    <form data-test-id="convention-form" onSubmit={saveConvention}>
      {convention && (
        <>
          <h3 data-test-id="convention-form-title">
            Modifier le statut de ma convention
          </h3>
          <p className="fr-mb-1w" data-test-id="convention-university-name">
            Vous êtes rattaché à l&apos;université de{' '}
            <b>{user.convention ? user.convention.universityName : ''}</b>.
          </p>
          <div id="convention-form">
            <RadioButtons
              legend="Avez-vous déjà signé la convention ?"
              hintText="Renseignez votre situation actuelle pour que nous puissions vous aider à avancer au besoin. Vous pourrez mettre à jour vos réponses plus tard si votre statut change."
              name="convention"
              orientation="horizontal"
              options={[
                {
                  label: 'Oui',
                  nativeInputProps: {
                    value: 'true',
                    checked: convention.isConventionSigned === true,
                    required: true,
                    onChange: () =>
                      setConvention({
                        ...convention,
                        isConventionSigned: true,
                      }),
                    'data-test-id': 'signed-true',
                  },
                },
                {
                  label: 'Non',
                  nativeInputProps: {
                    value: 'false',
                    checked: convention.isConventionSigned === false,
                    required: true,
                    onChange: () =>
                      setConvention({
                        ...convention,
                        isConventionSigned: false,
                      }),
                    'data-test-id': 'signed-false',
                  },
                },
              ]}
            />
          </div>

          <Button
            nativeButtonProps={{ type: 'submit' }}
            data-test-id="update-convention-button"
            iconId="fr-icon-check-line"
            disabled={convention.isConventionSigned === ''}
          >
            Enregistrer
          </Button>
        </>
      )}
    </form>
  );
};

export default ConventionForm;
