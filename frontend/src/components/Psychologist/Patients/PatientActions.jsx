import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';
import classnames from 'classnames';

import styles from './patientactions.cssmodule.scss';

const ShrinkableButton = props => (
  <>
    <Button
      {...props}
      data-test-id={props['data-test-id'] ? `${props['data-test-id']}-small` : undefined}
      className={classnames(props.icon, 'fr-displayed-xs fr-hidden-md')}
    />
    <Button
      {...props}
      data-test-id={props['data-test-id'] ? `${props['data-test-id']}-large` : undefined}
      icon={props.icon}
      className="fr-hidden-xs fr-displayed-md"
    >
      {props.children}
    </Button>
  </>
);

const PatientActions = ({ patient, deletePatient }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.cell}>
      <ShrinkableButton
        data-test-id="appointment-etudiant-button"
        onClick={() => navigate(`/psychologue/nouvelle-seance/${patient.id}`)}
        size="sm"
        icon="fr-fi-calendar-line"
        aria-label="Déclarer une séance"
      >
        Déclarer une séance
      </ShrinkableButton>
      <ShrinkableButton
        data-test-id="update-etudiant-button"
        onClick={() => navigate(`/psychologue/modifier-etudiant/${patient.id}`)}
        secondary
        size="sm"
        icon="fr-fi-edit-line"
        aria-label={!patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      >
        { !patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      </ShrinkableButton>
      <ShrinkableButton
        data-test-id="delete-etudiant-button"
        onClick={deletePatient}
        secondary
        size="sm"
        icon="fr-fi-delete-line"
        aria-label="Supprimer"
      >
        Supprimer
      </ShrinkableButton>
    </div>
  );
};

export default PatientActions;
