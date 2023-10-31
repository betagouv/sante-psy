import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Table, Callout, CalloutText, Icon } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { currentUnivYear, parseDateForm } from 'services/date';
import { useStore } from 'stores/';
import { MAX_APPOINTMENT } from '../Appointments/NewAppointment';

import PatientActionsLegend from './PatientActionsLegend';
import PatientActions from './PatientActions';
import PatientStatus from './PatientStatus';

import styles from './patients.cssmodule.scss';

const Patients = () => {
  const { commonStore: { config, setNotification } } = useStore();

  const [patients, setPatients] = useState([]);
  const [seeAppointments, setSeeAppointments] = useState(true);
  const table = useRef(null);

  const currentYear = currentUnivYear();

  const updateAppointentsColumns = () => {
    if (table.current) {
      const { width } = table.current.getBoundingClientRect();
      if (width < 375) {
        setSeeAppointments(false);
      } else {
        setSeeAppointments(true);
      }
    }
  };

  useEffect(() => {
    agent.Patient.get().then(setPatients);
    window.addEventListener('resize', updateAppointentsColumns);
    return () => window.removeEventListener('resize', updateAppointentsColumns);
  }, []);

  useEffect(() => {
    updateAppointentsColumns();
  }, [table]);

  const getMissingInfo = patient => {
    const DOCTOR_NAME = 'nom du docteur';
    const INSTITUTION_NAME = 'établissement scolaire';
    const DOCTOR_ADDRESS = 'adresse du docteur';
    const BIRTH_DATE = 'date de naissance';
    const STUDENT_STATUS = 'statut étudiant';
    const PRESCRIPTION = 'renouvellement';

    const missingInfo = [];

    if (!patient.doctorName?.trim()) {
      missingInfo.push(DOCTOR_NAME);
    }

    if (!patient.institutionName?.trim()) {
      missingInfo.push(INSTITUTION_NAME);
    }

    if (!patient.doctorAddress?.trim()) {
      missingInfo.push(DOCTOR_ADDRESS);
    }

    if (!patient.dateOfBirth && new Date(patient.createdAt) > parseDateForm(config.dateOfBirthDeploymentDate)) {
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
    const missingInfo = getMissingInfo(patient);
    return {
      ...patient,
      hasTooMuchAppointment: patient.appointmentsYearCount > MAX_APPOINTMENT,
      missingInfo,
      currentYear,
    };
  });

  const deletePatient = patientId => {
    setNotification({});
    agent.Patient.delete(patientId).then(response => {
      setNotification(response);
      setPatients(patients.filter(patient => patient.id !== patientId));
    });
  };

  const columns = [
    {
      name: 'name',
      label: 'Nom',
      render: patient => `${patient.lastName.toUpperCase()} ${patient.firstNames}`,
      sortable: true,
      sort: (a, b) => (`${a.lastName.toUpperCase()} ${a.firstNames}`).localeCompare(`${b.lastName.toUpperCase()} ${b.firstNames}`),
    },
    {
      name: 'status',
      label: 'Statut',
      render: PatientStatus,
      sortable: true,
      sort: (a, b) => a.missingInfo.length - b.missingInfo.length,
    }];
  if (seeAppointments) {
    columns.push({
      name: 'appointmentsYearCount',
      label: `Séances ${currentYear}`,
      sortable: true,
    });
    columns.push({ name: 'appointmentsCount', label: 'Séances total', sortable: true });
  }
  columns.push(
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
  );

  return (
    <>
      <Callout hasInfoIcon={false}>
        <CalloutText size="md">
          Nous vous rappelons que vous pouvez recevoir des étudiants quel que soit leur département,
          écoles supérieures/universités ou lieu de résidence.
        </CalloutText>
      </Callout>
      <div className="fr-my-2w">
        <Link
          id="new-student-button"
          to="/psychologue/nouvel-etudiant"
          className="fr-btn"
        >
          <Icon name="ri-add-line" />
          Nouvel étudiant
        </Link>
      </div>
      <div
        ref={table}
        id="students-table"
        className={classNames('fr-table', styles.table)}
      >
        {patients.length > 0 ? (
          <>
            <PatientActionsLegend />
            <Table
              data-test-id="etudiant-table"
              columns={columns}
              data={extendedPatients.sort((a, b) => b.missingInfo.length - a.missingInfo.length)}
              rowKey="id"
            />
          </>
        ) : (<span>Vous n‘avez pas encore déclaré d&lsquo;étudiants.</span>)}
      </div>
    </>
  );
};

export default observer(Patients);
