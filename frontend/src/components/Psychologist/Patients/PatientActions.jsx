import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';

import classNames from 'classnames';
import styles from './patientactions.cssmodule.scss';

const ShrinkableButton = ({ children, ...props }) => (
  <>
    <Button
      {...props}
      data-test-id={props['data-test-id'] ? `${props['data-test-id']}-small` : undefined}
      className={classNames(styles.button, 'fr-unhidden fr-hidden-md')}
    />
    <Button
      {...props}
      data-test-id={props['data-test-id'] ? `${props['data-test-id']}-large` : undefined}
      className={classNames(styles.largeButton, 'fr-hidden fr-unhidden-md')}
    >
      {children}
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
        icon="ri-calendar-line"
        aria-label="Déclarer une séance"
      >
        Déclarer une séance
      </ShrinkableButton>
      <ShrinkableButton
        data-test-id="update-etudiant-button"
        onClick={() => navigate(`/psychologue/modifier-etudiant/${patient.id}`)}
        secondary
        size="sm"
        icon="ri-edit-line"
        aria-label={!patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      >
        { !patient.hasFolderCompleted ? 'Compléter' : 'Modifier'}
      </ShrinkableButton>
      <ShrinkableButton
        data-test-id="delete-etudiant-button"
        onClick={deletePatient}
        disabled={patient.appointmentsCount !== '0'}
        title={patient.appointmentsCount !== '0' ? 'Vous ne pouvez pas supprimer un étudiant avec des séances' : ''}
        secondary
        size="sm"
        icon="ri-delete-bin-line"
        aria-label="Supprimer"
      >
        Supprimer
      </ShrinkableButton>
    </div>
  );
};

export default PatientActions;
