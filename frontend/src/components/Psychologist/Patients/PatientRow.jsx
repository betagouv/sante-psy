import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Tag } from '@dataesr/react-dsfr';

import classNames from 'classnames';
import styles from './patientRow.cssmodule.scss';

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
            ? (
              <Tag
                className={classNames(styles.incomplete, styles.small)}
                icon="fr-fi-alert-line"
                iconPosition="left"
                size="sm"
              />
            )
            : (
              <Tag
                className={classNames(styles.complete, styles.small)}
                icon="fr-fi-check-line"
                iconPosition="left"
                size="sm"
              />
            )}
        </div>
        <div className="fr-col-4 fr-col-xl-5 fr-hidden-xs fr-displayed-lg">
          { !patient.hasFolderCompleted
            ? (
              <Tag
                data-test-id="patient-row-missing-info"
                className={classNames(styles.incomplete, styles.big)}
                icon="fr-fi-alert-line"
                iconPosition="left"
                size="sm"
              >
                {`Informations manquantes : ${patient.missingInfo.join(', ')}`}
              </Tag>
            )
            : (
              <Tag
                data-test-id="patient-row-complete-info"
                className={classNames(styles.complete, styles.big)}
                icon="fr-fi-check-line"
                iconPosition="left"
                size="sm"
              >
                Dossier complet
              </Tag>
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
