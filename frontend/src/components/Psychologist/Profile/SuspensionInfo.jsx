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
          <p>
            Vos informations sont
            {' '}
            <b>visibles</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          <Button
            icon="fr-fi-delete-line"
            title="delete"
            onClick={() => history.push('/psychologue/mon-profil/suspendre')}
          >
            Retirer mes informations de l&lsquo;annuaire
          </Button>
        </>
      ) : (
        <>
          <p>
            Vos informations
            {' '}
            <b>ne sont pas visibles</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          <Button
            icon="fr-fi-delete-line"
            title="delete"
            onClick={activatePsychologist}
          >
            Activer mon compte
          </Button>
        </>
      )}

    </>
  );
};

export default SuspensionInfo;
