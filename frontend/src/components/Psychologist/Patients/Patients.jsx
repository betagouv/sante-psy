import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Alert, Table } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { parseDateForm } from 'services/date';

import { useStore } from 'stores/';

import PatientActions from './PatientActions';
import PatientStatus from './PatientStatus';

import styles from './patients.cssmodule.scss';

const Patients = () => {
  const { commonStore: { config, setNotification } } = useStore();

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    agent.Patient.get().then(setPatients);
  }, []);

  const getMissingInfo = patient => {
    const DOCTOR_NAME = 'nom du docteur';
    const INSTITUTION_NAME = 'établissement scolaire';
    const DOCTOR_ADDRESS = 'adresse du docteur';
    const BIRTH_DATE = 'date de naissance';
    const STUDENT_STATUS = 'statut étudiant';
    const PRESCRIPTION = 'orientation médicale';

    const missingInfo = [];

    if (!patient.doctorName || !patient.doctorName.trim()) {
      missingInfo.push(DOCTOR_NAME);
    }

    if (!patient.institutionName || !patient.institutionName.trim()) {
      missingInfo.push(INSTITUTION_NAME);
    }

    if (!patient.doctorAddress || !patient.doctorAddress.trim()) {
      missingInfo.push(DOCTOR_ADDRESS);
    }

    if (!patient.dateOfBirth && patient.createdAt > parseDateForm(config.dateOfBirthDeploymentDate)) {
      missingInfo.push(BIRTH_DATE);
    }

    if (!patient.isStudentStatusVerified) {
      missingInfo.push(STUDENT_STATUS);
    }

    if (!patient.hasPrescription) {
      missingInfo.push(PRESCRIPTION);
    }

    return missingInfo;
  };

  const extendedPatients = patients.map(patient => {
    patient.hasFolderCompleted = getMissingInfo(patient).length === 0;
    patient.missingInfo = getMissingInfo(patient);
    return patient;
  });

  const deletePatient = patientId => {
    setNotification({});
    agent.Patient.delete(patientId).then(response => {
      setNotification(response);
      setPatients(patients.filter(patient => patient.id !== patientId));
    });
  };

  const columns = [
    { name: 'lastName', label: 'Nom' },
    { name: 'firstNames', label: 'Prénoms' },
    { name: 'status', label: 'Statut', render: PatientStatus },
    {
      name: 'actions',
      label: '',
      render: patient => (
        <PatientActions
          patient={patient}
          deletePatient={() => deletePatient(patient.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="fr-my-2w">
        <Link
          to="/psychologue/nouvel-etudiant"
          className="fr-btn fr-fi-add-line fr-btn--icon-left"
        >
          Nouvel étudiant
        </Link>
      </div>
      <div className={classNames('fr-table', styles.table)}>
        {patients.length > 0 && extendedPatients.find(patient => !patient.hasFolderCompleted) && (
          <Alert
            data-test-id="etudiants-missing-info"
            className="fr-my-2w"
            title="Certains de vos étudiants n‘ont pas leur dossier complet"
            description="Ceci est obligatoire pour facturer les séances de l'étudiant."
            type="error"
          />
        )}
        {patients.length > 0 ? (
          <Table
            data-test-id="etudiant-table"
            columns={columns}
            data={extendedPatients.filter(patient => !patient.hasFolderCompleted)
              .concat(extendedPatients.filter(patient => patient.hasFolderCompleted))}
            rowKey="id"
          />
        ) : (<span>Vous n‘avez pas encore déclaré d&lsquo;étudiants.</span>)}
      </div>
    </>
  );
};

export default observer(Patients);
