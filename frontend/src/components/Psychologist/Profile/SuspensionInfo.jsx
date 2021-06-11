import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Button } from '@dataesr/react-dsfr';
import { useStore } from 'stores/';

const SuspensionInfo = ({ psychologist, activatePsychologist }) => {
  const history = useHistory();
  const { commonStore: { config } } = useStore();

  // TO REMOVE suspensionDepartment
  if (config.supsensionDepartments && !config.supsensionDepartments.includes(psychologist.departement)) {
    return <></>;
  }

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
// TO REMOVE suspensionDepartment
export default observer(SuspensionInfo);
