import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Table } from '@codegouvfr/react-dsfr/Table';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { CallOut } from '@codegouvfr/react-dsfr/CallOut';
import { Button } from '@codegouvfr/react-dsfr/Button';

import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import {
  formatFrenchDate,
  formatMonth,
  getFirstDayOfLastMonth,
  utcDate,
} from 'services/date';
import Badges from 'components/Badges/Badges';
import { useStore } from 'stores/';
import getBadgeInfos from 'src/utils/badges';
import { useNavigate } from 'react-router-dom';
import styles from './appointments.cssmodule.scss';
import { Tooltip } from 'components/Tooltip/Tooltip';

const Appointments = () => {
  const {
    commonStore: { setNotification },
  } = useStore();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setfilteredAppointments] = useState([]);
  const [filteredMonthAppointments, setFilteredMonthApointments] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);
  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const cantDeleteBefore = getFirstDayOfLastMonth();

  const navigate = useNavigate();
  const badges = getBadgeInfos();

  useEffect(() => {
    agent.Appointment.get({ month: month.month, year: month.year }).then(
      (response) => {
        setAppointments(response);
      },
    );
  }, [month]);

  useEffect(() => {
    setFilteredMonthApointments(getFilteredMonthAppointments());
  }, [appointments, filteredAppointments]);

  const deleteAppointment = (appointmentId) => {
    setNotification({});
    agent.Appointment.delete(appointmentId).then((response) => {
      setNotification(response);
      setAppointments(
        appointments.filter((appointment) => appointment.id !== appointmentId),
      );
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFilteredAppointments = appointments.filter(
      (patient) =>
        patient.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        patient.firstNames.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setfilteredAppointments(newFilteredAppointments);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleIconClick = (id) => {
    if (showTooltip === id) {
      setShowTooltip(null);
    } else {
      setShowTooltip(id);
    }
  };

  const getFilteredMonthAppointments = () => {
    const showAppointments =
      filteredAppointments.length > 0 ? filteredAppointments : appointments;
    return showAppointments.filter((appointment) => {
      const appointmentDate = utcDate(appointment.appointmentDate);
      return (
        appointmentDate.getFullYear() === month.year &&
        appointmentDate.getMonth() === month.month - 1
      );
    });
  };

  const sortAppointmentsByDate = (a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);

    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }
    return 0;
  };

  const headers = [
    'Date',
    '', // badge column
    <div key="student-header">
      Étudiant
      <Input
        className={styles.filter}
        nativeInputProps={{
          onClick: handleSearchClick,
          onChange: handleSearch,
          placeholder: 'Rechercher',
        }}
      />
    </div>, // actions column
    ,
  ];

  const tableData = [...filteredMonthAppointments]
    .sort((a, b) => sortAppointmentsByDate(a, b))
    .map((appointment) => {
      const canDelete =
        Date.parse(appointment.appointmentDate) >= cantDeleteBefore;

      const isInactive =
        appointment.badges && appointment.badges.includes(badges.inactive.key);

      const buttons = (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            data-test-id="delete-appointment-button-small"
            onClick={() => deleteAppointment(appointment.id)}
            priority="secondary"
            size="small"
            iconId="fr-icon-delete-bin-line"
            iconPosition="left"
            className="fr-unhidden fr-hidden-md fr-float-right"
            aria-label="Supprimer"
            disabled={!canDelete}
          />
          <Button
            data-test-id="delete-appointment-button-large"
            priority="secondary"
            size="small"
            onClick={() => deleteAppointment(appointment.id)}
            iconId="fr-icon-delete-bin-line"
            iconPosition="left"
            className="fr-hidden fr-unhidden-md"
            disabled={!canDelete}
          >
            Supprimer
          </Button>
        </div>
      );

      return [
        <div key={`date-${appointment.id}`} className={styles.date}>
          <div>{formatFrenchDate(utcDate(appointment.appointmentDate))}</div>
          {(appointment.badges.includes(badges.switch_rule_notice.key) ||
            appointment.badges.includes(badges.inactive.key)) && (
            <div
              className={styles.clickableElement}
              onClick={() => handleIconClick(appointment.id)}
            >
              <span
                className="ri-information-line"
                aria-hidden="true"
                style={{ fontSize: '1.5rem', color: '#000091' }}
              />
              {showTooltip === appointment.id && (
                <span className={styles.tooltip}>
                  {badges.switch_rule_notice.tooltip}
                </span>
              )}
            </div>
          )}
        </div>,
        <Badges
          isInactive={isInactive}
          badges={appointment.badges}
          univYear={appointment.univYear}
        />,
        <Tooltip
          key={`student-${appointment.id}`}
          tooltip="Séances de l'étudiant"
          data-test-id="etudiant-name"
          onClick={() =>
            navigate(
              `/psychologue/etudiant/${appointment.patientId}/#anchor-student-list`,
            )
          }
        >
          <div>
            {appointment.firstNames} {appointment.lastName}
          </div>
        </Tooltip>,
        canDelete ? (
          buttons
        ) : (
          <Tooltip
            key={`actions-${appointment.id}`}
            tooltip="Vous ne pouvez supprimer une séance que sur le mois en cours ou le mois précédent. Pour toute annulation antérieure, veuillez contacter le support."
          >
            {buttons}
          </Tooltip>
        ),
      ];
    });

  return (
    <>
      <CallOut>
        <span style={{ fontWeight: 'bold' }}>
          Rappel des conditions de remboursement
        </span>
        <ul>
          <li>
            <b>Depuis le 1er juillet 2024, 12 séances maximum</b> prises en
            charge par année universitaire, sans lettre d&apos;orientation, au
            tarif de 50€.
          </li>
          <li>
            Année universitaire : du <b>1er septembre au 31 août</b> de
            l&apos;année suivante
          </li>
          <li>
            Nous vous rappelons que dans le cadre du dispositif, il est
            strictement{' '}
            <b>interdit de demander aux étudiants une avance de frais</b> ou un
            complément.
          </li>
        </ul>
      </CallOut>
      <div className="fr-my-2w">
        <HashLink
          id="new-appointment-button"
          to="/psychologue/nouvelle-seance"
          className="fr-btn"
        >
          <div data-test-id="new-appointment-button">
            <span className="ri-add-line" aria-hidden="true" />
            Nouvelle séance
          </div>
        </HashLink>
      </div>
      <div className="fr-mb-2w">
        Veuillez trouver ci-dessous vos séances déclarées pour le mois
        sélectionné :
        <div className="fr-mt-1w">
          <MonthPicker
            month={month}
            setMonth={setMonth}
            id="appointment-month"
          />
        </div>
      </div>
      <div id="appointments-table">
        {filteredMonthAppointments.length > 0 ? (
          <Table
            data-test-id="appointments-table"
            className={styles.table}
            headers={headers}
            data={tableData}
          />
        ) : (
          <div>
            Vous n‘avez pas déclaré de séances pour le mois de{' '}
            {formatMonth(month)}.
          </div>
        )}
      </div>
    </>
  );
};

export default Appointments;
