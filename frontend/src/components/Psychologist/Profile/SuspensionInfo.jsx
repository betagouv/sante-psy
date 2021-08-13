import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '@dataesr/react-dsfr';

const SuspensionInfo = ({ psychologist, activatePsychologist }) => {
  const history = useHistory();

  return (
    <>
      <h5>Statut de mon compte</h5>
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
          ? history.push('/psychologue/mon-profil/suspendre')
          : activatePsychologist())}
      >
        {psychologist.active
          ? "Retirer mes informations de l'annuaire"
          : "Remettre mes informations de l'annuaire"}
      </Button>
    </>
  );
};
export default SuspensionInfo;
