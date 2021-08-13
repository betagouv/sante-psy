import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';
import classnames from 'classnames';

const ShrinkableButton = props => (
  <>
    <Button
      {...props}
      data-test-id={props['data-test-id'] ? `${props['data-test-id']}-small` : undefined}
      className={classnames(props.className, 'fr-displayed-xs fr-hidden-md')}
    />
    <Button
      {...props}
      data-test-id={props['data-test-id'] ? `${props['data-test-id']}-large` : undefined}
      className={classnames(props.className, 'fr-btn--icon-left fr-hidden-xs fr-displayed-md')}
    >
      {props.children}
    </Button>
  </>
);

const PatientActions = ({ patient, deletePatient }) => {
  const history = useHistory();
  return (
    <div className="list-actions">
      <ShrinkableButton
        data-test-id="appointment-etudiant-button"
        onClick={deletePatient}
        secondary
        size="sm"
        className="fr-fi-calendar-line"
        aria-label="seance"
      >
        Séance
      </ShrinkableButton>
      <ShrinkableButton
        data-test-id="update-etudiant-button"
        onClick={() => history.push(`/psychologue/modifier-etudiant/${patient.id}`)}
        secondary
        size="sm"
        className="fr-fi-edit-line"
        aria-label={!patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      >
        { !patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      </ShrinkableButton>
      <ShrinkableButton
        data-test-id="delete-etudiant-button"
        onClick={deletePatient}
        secondary
        size="sm"
        className="fr-fi-delete-line"
        aria-label="Supprimer"
      >
        Supprimer
      </ShrinkableButton>
    </div>
  );
};

export default PatientActions;
