import React from 'react';

import { Button } from '@dataesr/react-dsfr';
import SuspendProfile from './SuspendProfile';

const SuspensionInfo = ({
  psychologist,
  activatePsychologist,
  suspendPsychologist,
  suspensionMode,
  setSuspensionMode,
  cancelSuspension,
}) => (
  <>
    <h3>Statut de mon compte</h3>
    {suspensionMode
      ? (
        <SuspendProfile
          suspendPsychologist={suspendPsychologist}
          cancelSuspension={cancelSuspension}
        />
      )
      : (
        <>
          {' '}
          <p data-test-id={psychologist.active ? 'activePsy' : 'inactivePsy'} className="fr-mb-2w">
            Mes informations
            {' '}
            <b>{psychologist.active ? 'sont visibles' : 'ne sont pas visibles'}</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          { psychologist.active && (
            <p className="fr-mb-2w">
              Vous pouvez retirer vos informations temporairement de l&lsquo;annuaire afin de ne plus être contacté
              par des étudiants. Cela n&lsquo;influe en rien vos remboursements en cours et vous pourrez toujours
              déclarer vos séances. Vous pourrez reactiver votre compte à tout moment.
            </p>
          )}
          <div id="hide-profil-button">
            <Button
              data-test-id={psychologist.active ? 'suspend-redirection-button' : 'activate-button'}
              icon={psychologist.active ? 'fr-fi-eye-off-line' : 'fr-fi-eye-line'}
              className="fr-mb-2w"
              onClick={() => (psychologist.active
                ? setSuspensionMode(true)
                : activatePsychologist())}
            >
              {psychologist.active
                ? "Retirer mes informations de l'annuaire"
                : "Remettre mes informations de l'annuaire"}
            </Button>
          </div>
        </>
      )}
  </>
);
export default SuspensionInfo;
