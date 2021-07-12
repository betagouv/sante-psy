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
          <p data-test-id="activePsy" className="fr-mb-2v">
            Vos informations sont
            {' '}
            <b>visibles</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          <Button
            data-test-id="suspend-redirection-button"
            title="delete"
            onClick={() => history.push('/psychologue/mon-profil/suspendre')}
          >
            <span className="fr-fi-eye-off-line fr-mr-1w" aria-hidden="true" />
            Retirer mes informations de l&lsquo;annuaire
          </Button>
        </>
      ) : (
        <>
          <p data-test-id="inactivePsy" className="fr-mb-2v">
            Vos informations
            {' '}
            <b>ne sont pas visibles</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          <Button
            data-test-id="activate-button"
            title="delete"
            onClick={activatePsychologist}
          >
            <span className="fr-fi-eye-line fr-mr-1w" aria-hidden="true" />
            Remettre mes informations de l&lsquo;annuaire
          </Button>
        </>
      )}

    </>
  );
};
export default SuspensionInfo;
