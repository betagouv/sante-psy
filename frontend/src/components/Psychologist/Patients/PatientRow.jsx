import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';

const PatientRow = ({ patient, deletePatient }) => {
  const history = useHistory();
  return (
    <tr data-test-id="patient-row">
      <td>
        {patient.lastName}
      </td>
      <td>
        {patient.firstNames}
      </td>
      <td>
        <div className="fr-col-2 fr-col-md-1 fr-displayed-xs fr-hidden-lg">
          { !patient.hasFolderCompleted
            ? (<p className="fr-tag bg-orange-warning  fr-fi-alert-line fr-tag--sm" />)
            : (<p className="fr-tag bg-success fr-fi-check-line fr-tag--sm" />)}
        </div>
        <div className="fr-col-4 fr-col-xl-5 fr-hidden-xs fr-displayed-lg">
          { !patient.hasFolderCompleted
            ? (
              <p
                data-test-id="patient-row-missing-info"
                className="fr-tag bg-orange-warning  fr-fi-alert-line fr-tag--icon-left fr-tag--sm"
              >
                {`Informations manquantes : ${patient.missingInfo.join(', ')}`}
              </p>
            )
            : (
              <p
                data-test-id="patient-row-complete-info"
                className="fr-tag bg-success fr-fi-check-line fr-tag--icon-left fr-tag--sm"
              >
                Dossier complet
              </p>
            )}
        </div>
      </td>
      <td className="list-actions">
        <Button
          data-test-id="delete-patient-button-small"
          onClick={() => deletePatient(patient.id)}
          secondary
          size="sm"
          className="fr-fi-delete-line fr-displayed-xs fr-hidden-sm fr-float-right"
          aria-label="Supprimer"
        />
        <Button
          data-test-id="delete-patient-button-large"
          onClick={() => deletePatient(patient.id)}
          secondary
          size="sm"
          className="fr-fi-delete-line fr-btn--icon-left fr-hidden-xs fr-displayed-sm fr-float-right"
        >
          Supprimer
        </Button>

        <Button
          data-test-id="update-patient-button-small"
          onClick={() => history.push(`/psychologue/modifier-patient/${patient.id}`)}
          secondary
          size="sm"
          className="fr-fi-edit-line fr-displayed-xs fr-hidden-md fr-float-right"
          aria-label={!patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
        />
        <Button
          data-test-id="update-patient-button-large"
          onClick={() => history.push(`/psychologue/modifier-patient/${patient.id}`)}
          secondary
          size="sm"
          className="fr-fi-edit-line fr-btn--icon-left fr-hidden-xs fr-displayed-md fr-float-right"
        >
          { !patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
        </Button>
      </td>
    </tr>
  );
};

export default PatientRow;
