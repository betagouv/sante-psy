import React from 'react';

const PatientRow = ({ patient, deletePatient }) => (
  <tr>
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
            <p className="fr-tag bg-orange-warning  fr-fi-alert-line fr-tag--icon-left fr-tag--sm">
              Informations manquantes :
              {' '}
              {patient.missingInfo.join(',')}
            </p>
          )
          : (
            <p className="fr-tag bg-success fr-fi-check-line fr-tag--icon-left fr-tag--sm">
              Dossier complet
            </p>
          )}
      </div>
    </td>
    <td className="list-actions">
      <button
        onClick={() => deletePatient(patient.id)}
        type="button"
        className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-delete-line fr-displayed-xs fr-hidden-sm fr-float-right"
        aria-label="Supprimer"
      />
      <button
        type="button"
        onClick={() => deletePatient(patient.id)}
        className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-delete-line fr-btn--icon-left fr-hidden-xs fr-displayed-sm fr-float-right"
      >
        Supprimer
      </button>

      <button
        // onClick={() => }
        type="button"
        className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-edit-line fr-displayed-xs fr-hidden-md fr-float-right"
        aria-label={!patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      />
      <button
        type="button"
        // onClick={() => }
        className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-edit-line fr-btn--icon-left fr-hidden-xs fr-displayed-md fr-float-right"
      >
        { !patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      </button>
    </td>
  </tr>
);

export default PatientRow;
