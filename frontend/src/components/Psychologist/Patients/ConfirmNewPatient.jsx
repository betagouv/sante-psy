import React, { useState } from 'react';
import styles from './confirmNewPatient.cssmodule.scss';
import agent from 'services/agent';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
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
            <ButtonsGroup
              inlineLayoutWhen="always"
              buttons={[
                {
                  children: 'Annuler',
                  priority: 'secondary',
                  onClick: onCancel,
                },
                {
                  children: 'Confirmer',
                  nativeButtonProps: { type: 'submit' },
                },
              ]}
            />
          </Stack>
        </form>
      )}
      {addedPatient && (
        <>
          <Alert
            severity="success"
            description="Vous pouvez dès à présent le retrouver dans votre liste de suivi des étudiants."
            title="Étudiant ajouté"
          />
          <ul className={fr.cx('fr-btns-group', 'fr-btns-group--inline')}>
            <li>
              <HashLink
                to="/psychologue/nouvelle-seance"
                state={{ patientId: addedPatient.id }}
                className="fr-btn"
              >
                <span
                  className={fr.cx('fr-icon-add-line', 'fr-btn--icon-left')}
                />
                Nouvelle séance
              </HashLink>
            </li>
            <li>
              <HashLink
                to={`/psychologue/etudiant/${addedPatient.id}`}
                className="fr-btn"
              >
                Voir le dossier
              </HashLink>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default ConfirmNewPatient;
