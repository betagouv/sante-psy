import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Button, Table, Icon, TextInput, Callout, CalloutText } from '@dataesr/react-dsfr';

import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth, utcDate } from 'services/date';
import Badges from 'components/Badges/Badges';
import { useStore } from 'stores/';
import getBadgeInfos from 'src/utils/badges';
import { useNavigate } from 'react-router-dom';
import styles from './appointments.cssmodule.scss';

const Appointments = () => {
  const { commonStore: { setNotification } } = useStore();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setfilteredAppointments] = useState([]);
  const [filteredMonthAppointments, setFilteredMonthApointments] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);
  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const navigate = useNavigate();
  const badges = getBadgeInfos();

  useEffect(() => {
    agent.Appointment.get({ month: month.month, year: month.year })
      .then(response => {
        setAppointments(response);
      });
  }, [month]);

  useEffect(() => {
    setFilteredMonthApointments(getFilteredMonthAppointments());
  }, [appointments, filteredAppointments]);

  const deleteAppointment = appointmentId => {
    setNotification({});
    agent.Appointment.delete(appointmentId).then(response => {
      setNotification(response);
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    });
  };

  const handleSearch = e => {
    e.preventDefault();
    e.stopPropagation();
    const newFilteredAppointments = appointments.filter(patient => patient.lastName.toLowerCase().includes(e.target.value.toLowerCase())
      || patient.firstNames.toLowerCase().includes(e.target.value.toLowerCase()));
    setfilteredAppointments(newFilteredAppointments);
  };

  const handleSearchClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleIconClick = id => {
    if (showTooltip === id) {
      setShowTooltip(null);
    } else {
      setShowTooltip(id);
    }
  };

  const getFilteredMonthAppointments = () => {
    const showAppointments = filteredAppointments.length > 0 ? filteredAppointments : appointments;
    return showAppointments.filter(appointment => {
      const appointmentDate = utcDate(appointment.appointmentDate);
      return appointmentDate.getFullYear() === month.year
        && appointmentDate.getMonth() === month.month - 1;
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

  const columns = [
    {
      name: 'date',
      label: 'Date',
      render: appointment => (
        <div className={styles.date}>
          <div>{formatFrenchDate(utcDate(appointment.appointmentDate))}</div>
          {(appointment.badges.includes(badges.switch_rule_notice.key) || appointment.badges.includes(badges.inactive.key))
            && (
            <div
              className={styles.clickableElement}
              onClick={() => handleIconClick(appointment.id)}
            >
              <Icon
                name="ri-information-line"
                size="lg"
                color="#000091"
                iconPosition="right"

              />
              {showTooltip === appointment.id && (
              <span className={styles.tooltip}>
                {badges.switch_rule_notice.tooltip}
              </span>
              )}
            </div>
            )}
        </div>
      ),
      sortable: true,
      sort: (a, b) => sortAppointmentsByDate(a, b),
    },
    {
      name: 'badge',
      label: '',
      render: appointment => {
        const isInactive = appointment.badges && appointment.badges.includes(badges.inactive.key);
        return <Badges isInactive={isInactive} badges={appointment.badges} univYear={appointment.univYear} />;
      },
    },
    {
      name: 'student',
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
      render: ({ patientId, firstNames, lastName }) => (
        <div data-test-id="etudiant-name" className={styles.hoverElement} onClick={() => navigate(`/psychologue/modifier-etudiant/${patientId}/#anchor-student-list`)}>
          <span className={styles.tooltip}>Séances de l&apos;étudiant</span>
          <div>
            {firstNames}
            {' '}
            {lastName}
          </div>
        </div>
      ),
    },
    {
      name: 'actions',
      label: '',
      render: appointment => (
        <>
          <Button
            data-test-id="delete-appointment-button-small"
            onClick={() => deleteAppointment(appointment.id)}
            secondary
            size="sm"
            icon="ri-delete-bin-line"
            className="fr-unhidden fr-hidden-sm fr-float-right"
            aria-label="Supprimer"
          />
          <Button
            data-test-id="delete-appointment-button-large"
            secondary
            size="sm"
            onClick={() => deleteAppointment(appointment.id)}
            icon="ri-delete-bin-line"
            className="fr-hidden fr-unhidden-sm fr-float-right"
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Callout hasInfoIcon={false}>
        <CalloutText size="md">
          <span style={{ fontWeight: 'bold' }}>
            Rappel des conditions de remboursement
          </span>
          <ul>
            <li>
              <b>Depuis le 1er juillet 2024, 12 séances maximum</b>
              {' '}
              prises en charge par année universitaire, sans lettre d&apos;orientation, au tarif de 50€.
              Si vous aviez effectué 8 séances avec un étudiant, vous pouvez, entre le 1er juillet 2024 et le 31 aout, aller jusque 12 séances pour le cycle 2023/2024.
            </li>
            <li>
              Année universitaire : du
              {' '}
              <b>1er septembre au 31 août</b>
              {' '}
              de l&apos;année suivante
            </li>
            <li>
              Nous vous rappelons que dans le cadre du dispositif, il est strictement
              {' '}
              <b>interdit de demander aux étudiants une avance de frais</b>
              {' '}
              ou un complément.
            </li>
          </ul>
        </CalloutText>
      </Callout>
      <div className="fr-my-2w">
        <HashLink
          id="new-appointment-button"
          to="/psychologue/nouvelle-seance"
          className="fr-btn"
        >
          <div data-test-id="new-appointment-button">
            <Icon name="ri-add-line" />
            Nouvelle séance
          </div>
        </HashLink>
      </div>
      <div className="fr-mb-2w">
        Veuillez trouver ci-dessous vos séances déclarées pour le mois sélectionné :
        <div className="fr-mt-1w">
          <MonthPicker month={month} setMonth={setMonth} id="appointment-month" />
        </div>
      </div>
      <div id="appointments-table">
        {filteredMonthAppointments.length > 0 ? (
          <Table
            data-test-id="appointments-table"
            className={styles.table}
            columns={columns}
            data={filteredMonthAppointments}
            rowKey="id"
          />
        ) : (
          <div>
            Vous n‘avez pas déclaré de séances pour le mois de
            {' '}
            {formatMonth(month)}
            .
          </div>
        )}
      </div>
    </>
  );
};

export default Appointments;
