import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Table, Callout, CalloutText, Icon, Button } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { currentUnivYear } from 'services/date';
import { useStore } from 'stores/';
import { MAX_APPOINTMENT } from '../Appointments/NewAppointment';

import PatientStatus from './PatientStatus';

import styles from './patients.cssmodule.scss';
import { arePrescriptionInfosFilled, areStudentInfosFilled } from './AddEditPatient';

const Patients = () => {
  const { commonStore: { setNotification } } = useStore();
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

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
    const missingInfo = {};

    missingInfo.missingStudentInfo = !areStudentInfosFilled(patient);
    missingInfo.missingPrescriptionInfo = !arePrescriptionInfosFilled(patient);

    return missingInfo;
  };

  const extendedPatients = patients.map(patient => {
    const missingInfo = getMissingInfo(patient);

    return {
      ...patient,
      hasReachedMaxAppointment: patient.appointmentsYearCount === MAX_APPOINTMENT.toString(),
      hasTooMuchAppointment: patient.appointmentsYearCount > MAX_APPOINTMENT,
      missingInfo,
      currentYear,
    };
  });
  const deletePatient = patientId => {
    setNotification({});
    agent.Patient.delete(patientId).then(response => {
      const filteredPatients = patients.filter(patient => patient.id !== patientId);
      setPatients(filteredPatients);
      setNotification(response);
    });
  };

  const columns = [
    {
      name: 'name',
      label: 'Étudiant',
      render: patient => (
        <div className={styles.clickableElement} onClick={() => navigate(`/psychologue/modifier-etudiant/${patient.id}`)}>
          <span className={styles.tooltip}>Dossier de l&apos;étudiant</span>
          {patient.lastName.toUpperCase()}
          {' '}
          {patient.firstNames}
        </div>
      ),
      sortable: true,
      sort: (a, b) => (`${a.lastName.toUpperCase()} ${a.firstNames}`).localeCompare(`${b.lastName.toUpperCase()} ${b.firstNames}`),
    },
    {
      name: 'update-etudiant-button',
      render: patient => (
        <div className={styles.clickableElement}>
          <span className={styles.tooltip}>Dossier de l&apos;étudiant</span>
          <Button
            data-test-id="update-etudiant-button"
            onClick={() => navigate(`/psychologue/modifier-etudiant/${patient.id}`)}
            secondary
            size="sm"
            icon="ri-folder-line"
            aria-label="Dossier de l'étudiant"
          />
        </div>
      ),
    },
    {
      name: 'status',
      label: 'Information',
      render: patient => (
        <PatientStatus
          patient={patient}
        />
      ),
      sortable: true,
      sort: (a, b) => a.missingInfo.length - b.missingInfo.length,
    }];
  if (seeAppointments) {
    columns.push({
      name: 'appointmentsYearCount',
      label: `Total séances ${currentYear}`,
      sortable: true,
    });
    columns.push({ name: 'appointmentsCount', label: 'Total séances', sortable: true });
  }
  columns.push(
    {
      name: 'appointment-etudiant-button',
      label: 'Déclarer une séance',
      render: patient => (
        <div className={styles.clickableElement}>
          <span className={styles.tooltip}>Déclarer une séance</span>
          <Button
            data-test-id="appointment-etudiant-button"
            onClick={() => navigate(`/psychologue/nouvelle-seance/${patient.id}`)}
            size="sm"
            icon="ri-calendar-line"
            aria-label="Déclarer une séance"
          />
        </div>
      ),
    },
    {
      name: 'delete-etudiant-button',
      label: "Supprimer l'étudiant",
      render: patient => (
        <div className={styles.clickableElement}>
          <span className={styles.tooltip}>{patient.appointmentsCount !== '0' ? 'Vous ne pouvez pas supprimer un étudiant avec des séances' : 'Supprimer'}</span>
          <Button
            data-test-id="delete-etudiant-button"
            onClick={() => deletePatient(patient.id)}
            disabled={patient.appointmentsCount !== '0'}
            secondary
            size="sm"
            icon="ri-delete-bin-line"
            aria-label="Supprimer"
          />
        </div>
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
          data-test-id="new-student-button"
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
          <Table
            data-test-id="etudiant-table"
            columns={columns}
            data={extendedPatients.sort((a, b) => b.missingInfo.length - a.missingInfo.length)}
            rowKey="id"
            />
        ) : (<span>Vous n‘avez pas encore déclaré d&lsquo;étudiants.</span>)}
      </div>
    </>
  );
};

export default observer(Patients);
