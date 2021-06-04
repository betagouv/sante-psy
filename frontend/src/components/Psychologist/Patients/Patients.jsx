import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';
import PatientRow from 'components/Psychologist/Patients/PatientRow';

import agent from 'services/agent';
import date from 'services/date';

import { useStore } from 'stores/';

import styles from './patients.cssmodule.scss';

const Patients = () => {
  const { commonStore: { config, setNotification } } = useStore();

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    agent.Patient.get()
      .then(response => {
        setPatients(response.patients);
      });
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

    if (!patient.dateOfBirth && patient.createdAt > date.parseDateForm(config.dateOfBirthDeploymentDate)) {
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

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w">
      <h1>Gérer mes patients</h1>
      <GlobalNotification />
      {' '}
      <div className="fr-grid-row fr-grid-row--left">
        <div className="fr-col-12">
          <h2 className="fr-mb-2w">
            Mes patients
          </h2>
          <div className="fr-mb-2w">
            <Link
              to="/psychologue/nouveau-patient"
              className="fr-btn fr-fi-add-line fr-btn--icon-left"
            >
              Nouveau patient
            </Link>
          </div>
          <div className={classNames('fr-table', styles.table)}>
            {patients.length > 0 && extendedPatients.find(patient => !patient.hasFolderCompleted) && (
            <div className="fr-callout fr-mb-2w">
              <p
                data-test-id="patients-missing-info"
                className="fr-text--md fr-mb-1v"
              >
                Certains de vos patients n‘ont pas leur dossier complet - vérification du statut d‘étudiant,
                l‘orientation du medecin, le nom du medecin, sa ville, ou l‘université du patient, ou date de
                naissance (obligatoire uniquement pour vos patients enregistrés après le
                {' '}
                {config.dateOfBirthDeploymentDate}
                ) sont manquants.
                <br />
                <strong>
                  Ceci est obligatoire pour facturer les séances du patient.
                </strong>
              </p>
            </div>
            )}
            <div className="fr-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      Nom
                    </th>
                    <th scope="col">
                      Prenom
                    </th>
                    <th scope="col">
                      Statut
                    </th>
                    <th scope="col">
                      {' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {extendedPatients.filter(patient => !patient.hasFolderCompleted).map(patient => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      deletePatient={deletePatient}
                    />
                  ))}
                  {extendedPatients.filter(patient => patient.hasFolderCompleted).map(patient => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      deletePatient={deletePatient}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {patients.length === 0 && <span>Vous n‘avez pas encore déclaré de patients.</span>}
          </div>
        </div>
      </div>
      <Mail />
    </div>
  );
};

export default observer(Patients);
