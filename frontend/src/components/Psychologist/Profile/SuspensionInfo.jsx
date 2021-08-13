import React from 'react';

import { Button } from '@dataesr/react-dsfr';
import SuspendProfile from './SuspendProfile';

const SuspensionInfo = ({
  psychologist,
  activatePsychologist,
  suspendPsychologist,
  suspensionMode,
  setSuspensionMode,
}) => (
  <>
    <h5>Statut de mon compte</h5>
    {suspensionMode
      ? (
        <SuspendProfile
          suspendPsychologist={suspendPsychologist}
        />
      )
      : (
        <>
          {' '}
          <p data-test-id={psychologist.active ? 'activePsy' : 'inactivePsy'} className="fr-mb-2v">
            Mes informations
            {' '}
            <b>{psychologist.active ? 'sont visibles' : 'ne sont pas visibles'}</b>
            {' '}
            sur l&lsquo;annuaire.
          </p>
          <Button
            data-test-id={psychologist.active ? 'suspend-redirection-button' : 'activate-button'}
            icon={psychologist.active ? 'fr-fi-eye-off-line' : 'fr-fi-eye-line'}
            onClick={() => (psychologist.active
              ? setSuspensionMode(true)
              : activatePsychologist())}
          >
            {psychologist.active
              ? "Retirer mes informations de l'annuaire"
              : "Remettre mes informations de l'annuaire"}
          </Button>
        </>
      )}
  </>
);
export default SuspensionInfo;
