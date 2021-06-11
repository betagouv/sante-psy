import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '@dataesr/react-dsfr';

const SuspensionInfo = ({ psychologist, activatePsychologist }) => {
  const history = useHistory();

  return (
    <>
      <h2>Statut de votre compte</h2>
      {psychologist.active ? (
        <>
          <p data-test-id="activePsy">
            Vos informations sont
            {' '}
            <b>visibles</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          <Button
            data-test-id="suspend-redirection-button"
            icon="fr-fi-eye-off-line"
            title="delete"
            onClick={() => history.push('/psychologue/mon-profil/suspendre')}
          >
            Retirer mes informations de l&lsquo;annuaire
          </Button>
        </>
      ) : (
        <>
          <p data-test-id="unactivePsy">
            Vos informations
            {' '}
            <b>ne sont pas visibles</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          <Button
            data-test-id="activate-button"
            icon="fr-fi-eye-line"
            title="delete"
            onClick={activatePsychologist}
          >
            Remettre mes informations de l&lsquo;annuaire
          </Button>
        </>
      )}

    </>
  );
};

export default SuspensionInfo;
