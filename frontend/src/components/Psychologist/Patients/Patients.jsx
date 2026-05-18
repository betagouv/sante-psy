import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Table, Icon, Button, Select, TextInput } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { currentUnivYear } from 'services/univYears';
import { useStore } from 'stores/';
import getBadgeInfos from 'src/utils/badges';
import styles from './patients.cssmodule.scss';
import Badges from '../../Badges/Badges';
import { Tooltip } from 'components/Tooltip/Tooltip';

const Patients = () => {
  const {
    commonStore: { setNotification },
  } = useStore();
  const [patients, setPatients] = useState([]);
  const [filterBadgeValue, setFilterBadgeValue] = useState('');
  const [filteredPatients, setfilteredPatients] = useState([]);
  const [filterOptions, setfilterOptions] = useState([]);
  const [seeAppointments, setSeeAppointments] = useState(true);

  const table = useRef(null);
  const navigate = useNavigate();
  const currentYear = currentUnivYear();
  const badgeInfo = getBadgeInfos(true, currentYear);

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

  const renderFilterOptions = () => {
    const uniqueBadges = patients
      .flatMap((patient) => patient.badges)
      .filter((value, index, array) => array.indexOf(value) === index);

    const uniqueBadgesOptions = uniqueBadges.map((badge) => ({
      label: badgeInfo[badge].text,
      value: badge,
    }));
    uniqueBadgesOptions.splice(0, 0, { label: 'Tous', value: 'all' });

    return uniqueBadgesOptions;
  };

  useEffect(() => {
    agent.Patient.get().then((response) => {
      setPatients(response);
    });

    window.addEventListener('resize', updateAppointentsColumns);
    return () => window.removeEventListener('resize', updateAppointentsColumns);
  }, []);

  useEffect(() => {
    updateAppointentsColumns();
  }, [table]);

  useEffect(() => {
    setfilterOptions(renderFilterOptions());
  }, [patients]);

  const actionOptions = [
    { label: '', value: '' },
    { label: 'Dossier', value: 'student_file' },
    { label: 'Séances', value: 'appointment_list' },
    { label: 'Déclarer', value: 'appointment_create' },
    { label: 'Supprimer', value: 'delete_student' },
  ];

  const onChangeAction = (e, patientId) => {
    e.preventDefault();
    e.stopPropagation();
    switch (e.target.value) {
      case 'student_file':
        navigate(`/psychologue/etudiant/${patientId}/#anchor-student-file`);
        break;
      case 'appointment_list':
        navigate(`/psychologue/etudiant/${patientId}/#anchor-student-file`);
        break;
      case 'appointment_create':
        navigate(`/psychologue/nouvelle-seance/${patientId}`);
        break;
      case 'delete_student':
        deletePatient(patientId);
        break;
      default:
        break;
    }
  };

  const deletePatient = (patientId) => {
    setNotification({});
    agent.Patient.delete(patientId).then((response) => {
      const newFilteredPatients = patients.filter(
        (patient) => patient.id !== patientId,
      );
      setPatients(newFilteredPatients);
      setNotification(response);
    });
  };

  const handleFilterChange = (badgeType) => {
    if (badgeType.target.value === 'all') {
      setFilterBadgeValue('');
      setfilteredPatients(patients);
      return;
    }
    setFilterBadgeValue(badgeType.target.value);
    const newFilteredPatients = patients.filter((patient) =>
      patient.badges.includes(badgeType.target.value),
    );
    setfilteredPatients(newFilteredPatients);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFilterBadgeValue('');
    const newFilteredPatients = patients.filter(
      (patient) =>
        patient.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        patient.firstNames.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setfilteredPatients(newFilteredPatients);
  };
  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const convertToMobileView = () => {
    columns.splice(1, 1);
    columns.splice(2, 5);
    columns.push({
      name: 'select-action',
      label: 'Actions',
      render: (patient) => (
        <Select
          selected={null}
          onChange={(e) => {
            onChangeAction(e, patient.id);
          }}
          options={actionOptions}
          className={styles.selectAction}
        />
      ),
    });
    return columns;
  };

  const columns = [
    {
      name: 'name',
      label: (
        <div>
          Étudiant
          <TextInput
            onClick={handleSearchClick}
            onChange={handleSearch}
            placeholder="Rechercher"
            className={styles.filter}
          />
        </div>
      ),
      render: (patient) => (
        <Tooltip
          tooltip="Dossier de l'étudiant"
          data-test-id="etudiant-name"
          onClick={() =>
            navigate(
              `/psychologue/modifier-etudiant/${patient.id}/#anchor-student-file`,
            )
          }
        >
          {patient.lastName.toUpperCase()} {patient.firstNames}
        </Tooltip>
      ),
      sortable: true,
      sort: (a, b) =>
        `${a.lastName.toUpperCase()} ${a.firstNames}`.localeCompare(
          `${b.lastName.toUpperCase()} ${b.firstNames}`,
        ),
    },
    {
      name: 'update-etudiant-button',
      render: (patient) => (
        <Tooltip tooltip="Dossier de l'étudiant">
          <Button
            data-test-id="update-etudiant-button"
            onClick={() =>
              navigate(
                `/psychologue/etudiant/${patient.id}/#anchor-student-file`,
              )
            }
            secondary
            size="sm"
            icon="ri-folder-line"
            aria-label="Dossier de l'étudiant"
            title="Dossier de l'étudiant"
          />
        </Tooltip>
      ),
    },
    {
      name: 'status',
      label: (
        <div className={styles.informationColumn}>
          Information{' '}
          <Select
            onChange={handleFilterChange}
            options={filterOptions}
            selected={filterBadgeValue}
            className={styles.filter}
          />
        </div>
      ),
      render: (patient) => (
        <Badges badges={patient.badges} univYear={currentYear} />
      ),
    },
    {
      name: 'countedAppointments',
      label: `Total séances ${currentYear}`,
      sortable: true,
    },
    { name: 'appointmentsCount', label: 'Total séances', sortable: true },
    {
      name: 'appointments-list-button',
      label: 'Liste des séances',
      render: (patient) => (
        <Tooltip tooltip="Liste des séances">
          <Button
            data-test-id="seances-etudiant-button"
            onClick={() =>
              navigate(
                `/psychologue/etudiant/${patient.id}/#anchor-student-list`,
              )
            }
            secondary
            size="sm"
            icon="ri-list-unordered"
            aria-label="Liste des séances"
            title="Liste des séances"
          />
        </Tooltip>
      ),
    },
    {
      name: 'appointment-etudiant-button',
      label: 'Déclarer une séance',
      render: (patient) => (
        <Tooltip tooltip="Déclarer une séance">
          <Button
            data-test-id="appointment-etudiant-button"
            onClick={() =>
              navigate(`/psychologue/nouvelle-seance/${patient.id}`)
            }
            size="sm"
            icon="ri-calendar-line"
            aria-label="Déclarer une séance"
          />
        </Tooltip>
      ),
    },
    {
      name: 'delete-etudiant-button',
      label: "Supprimer l'étudiant",
      render: (patient) => (
        <Tooltip
          tooltip={
            patient.appointmentsCount !== '0'
              ? 'Vous ne pouvez pas supprimer un étudiant avec des séances'
              : 'Supprimer'
          }
        >
          <Button
            data-test-id="delete-etudiant-button"
            onClick={() => deletePatient(patient.id)}
            disabled={patient.appointmentsCount !== '0'}
            secondary
            size="sm"
            icon="ri-delete-bin-line"
            aria-label="Supprimer"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
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
            columns={seeAppointments ? columns : convertToMobileView(columns)}
            data={filteredPatients.length > 0 ? filteredPatients : patients}
            rowKey="id"
          />
        ) : (
          <span>Vous n&lsquo;avez pas encore déclaré d&lsquo;étudiants.</span>
        )}
      </div>
    </>
  );
};

export default observer(Patients);
