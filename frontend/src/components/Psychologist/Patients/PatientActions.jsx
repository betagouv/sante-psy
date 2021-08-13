import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';

const PatientActions = ({ patient, deletePatient }) => {
  const history = useHistory();
  return (
    <div className="list-actions">
      <Button
        data-test-id="delete-etudiant-button-small"
        onClick={deletePatient}
        secondary
        size="sm"
        className="fr-fi-delete-line fr-displayed-xs fr-hidden-md fr-float-right"
        aria-label="Supprimer"
      />
      <Button
        data-test-id="delete-etudiant-button-large"
        onClick={deletePatient}
        secondary
        size="sm"
        className="fr-fi-delete-line fr-btn--icon-left fr-hidden-xs fr-displayed-md fr-float-right"
      >
        Supprimer
      </Button>

      <Button
        data-test-id="update-etudiant-button-small"
        onClick={() => history.push(`/psychologue/modifier-etudiant/${patient.id}`)}
        secondary
        size="sm"
        className="fr-fi-edit-line fr-displayed-xs fr-hidden-md fr-float-right"
        aria-label={!patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      />
      <Button
        data-test-id="update-etudiant-button-large"
        onClick={() => history.push(`/psychologue/modifier-etudiant/${patient.id}`)}
        secondary
        size="sm"
        className="fr-fi-edit-line fr-btn--icon-left fr-hidden-xs fr-displayed-md fr-float-right"
      >
        { !patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      </Button>
    </div>
  );
};

export default PatientActions;
