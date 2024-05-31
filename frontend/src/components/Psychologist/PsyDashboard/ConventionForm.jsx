import React, { useEffect, useState } from 'react';
import { Button, RadioGroup, Radio } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { useStore } from 'stores/';
import { useNavigate } from 'react-router-dom';

const ConventionForm = ({ onConventionUpdated = () => {} }) => {
  const [convention, setConvention] = useState();
  const navigate = useNavigate();

  const { commonStore: { setNotification }, userStore: { setUser, user } } = useStore();

  useEffect(() => {
    setConvention({ isConventionSigned: user.convention ? user.convention.isConventionSigned : '' });
  }, [user.convention]);

  const saveConvention = e => {
    e.preventDefault();
    setNotification({});
    agent.Convention
      .save(convention)
      .then(response => {
        setNotification(response);
        setUser({ convention: response.convention });
        onConventionUpdated();
        navigate('/psychologue/tableau-de-bord');
      });
  };

  let defaultValueConventionSigned;
  if (convention && convention.isConventionSigned !== '' && convention.isConventionSigned !== undefined) {
    defaultValueConventionSigned = convention.isConventionSigned ? 'true' : 'false';
  }

  return (
    <form data-test-id="convention-form" onSubmit={saveConvention}>
      {convention && (
        <>
          <h3>Modifier le statut de ma convention</h3>
          <p className="fr-mb-1w">
            Vous êtes rattaché à l&lsquo;université de
            {' '}
            <b>{user.convention ? user.convention.universityName : ''}</b>
            .
          </p>
          <div id="convention-form">
            <RadioGroup
              name="convention"
              legend="Avez-vous déjà signé la convention ?"
              hint="Renseignez votre situation actuelle pour que nous puissions vous aider à avancer au besoin.
            Vous pourrez mettre à jour vos réponses plus tard si votre statut change."
              value={defaultValueConventionSigned}
              onChange={value => setConvention({ ...convention, isConventionSigned: value === 'true' })}
              required
              isInline
            >
              <Radio
                data-test-id="signed-true"
                label="Oui"
                value="true"
              />
              <Radio
                data-test-id="signed-false"
                label="Non"
                value="false"
              />
            </RadioGroup>
          </div>
          <Button
            submit
            data-test-id="update-convention-button"
            icon="fr-fi-check-line"
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
