import React, { useState } from 'react';
import styles from './confirmNewPatient.cssmodule.scss';
import agent from 'services/agent';
import { ButtonGroup, Button, Alert, Icon } from '@dataesr/react-dsfr';
import { HashLink } from 'react-router-hash-link';
import { Stack } from 'components/Utils/Stack';
import NewAppointmentSeeCertificate from '../Appointments/NewAppointmentSeeCertificate';
import { getUnivYear } from 'services/univYears';
import {
  StatusNotEligible,
  StatusPendingEligibility,
  StatusUpToDate,
} from './PatientStatus';

const getStudentData = (student) => [
  {
    key: 'lastname',
    title: 'Nom',
    value: student.lastName,
  },
  {
    key: 'firstname',
    title: 'Prénom',
    value: student.firstNames,
  },
  {
    key: 'ine',
    title: 'INE',
    value: student.ine,
  },

  {
    key: 'birthDate',
    title: 'Date de naissance',
    value: new Date(student.dateOfBirth).toLocaleDateString('fr-FR'),
  },
  {
    key: 'schoolname',
    title: 'Établissement',
    value: student.school_name,
  },
];

const ConfirmNewPatient = ({ foundStudent, onCancel }) => {
  const [addedPatient, setAddedPatient] = useState(null);

  const addPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await agent.Patient.create({
        studentId: foundStudent.id,
      });
      if (res.newPatient) {
        setAddedPatient(res.newPatient);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayStudentInfo = (student) => (
    <div className={styles.studentInfoWrapper}>
      <div className={styles.infoColumn}>
        {getStudentData(student).map(({ key, title, value }) => (
          <div key={key} className={styles.infoRow}>
            <span className={styles.infoTitle}>{title}</span>
            <span className={styles.infoValue}>{value}</span>
          </div>
        ))}
      </div>
      <div className={styles.certificateColumn}>
        <NewAppointmentSeeCertificate
          studentId={student.id}
          univYear={getUnivYear(new Date(), '-')}
        />
      </div>
    </div>
  );

  return (
    <>
      <h3>Informations de l'étudiant</h3>
      {displayStudentInfo(foundStudent)}
      {!addedPatient && (
        <form onSubmit={addPatient}>
          <Stack>
            {foundStudent?.eligibility?.status === 'ELIGIBLE' && (
              <StatusUpToDate />
            )}
            {foundStudent?.eligibility?.status === 'NOT_ELIGIBLE' && (
              <StatusNotEligible />
            )}
            {foundStudent?.eligibility?.status === 'PENDING' && (
              <StatusPendingEligibility />
            )}
            <ButtonGroup isInlineFrom="xs">
              <Button secondary onClick={onCancel}>
                Annuler
              </Button>
              <Button submit>Confirmer</Button>
            </ButtonGroup>
          </Stack>
        </form>
      )}
      {addedPatient && (
        <>
          <Alert
            type="success"
            description="Vous pouvez dès à présent déclarer des séances pour cet étudiant"
            title="Étudiant ajouté"
          />
          <ButtonGroup isInlineFrom="xs">
            <HashLink
              to="/psychologue/nouvelle-seance"
              state={{ patientId: addedPatient.id }}
              className="fr-btn"
            >
              <div>
                <Icon name="ri-add-line" />
                Nouvelle séance
              </div>
            </HashLink>
            <HashLink
              to={`/psychologue/etudiant/${addedPatient.id}`}
              className="fr-btn"
            >
              <div>Voir le dossier</div>
            </HashLink>
          </ButtonGroup>
        </>
      )}
    </>
  );
};

export default ConfirmNewPatient;
