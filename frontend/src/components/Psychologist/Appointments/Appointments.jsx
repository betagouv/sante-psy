import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Button, Table, Callout, CalloutText, Icon, TextInput } from '@dataesr/react-dsfr';

import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth, utcDate } from 'services/date';
import Badges from 'components/Badges/Badges';
import { useStore } from 'stores/';
import styles from './appointments.cssmodule.scss';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setfilteredAppointments] = useState([]);
  const [filteredMonthAppointments, setFilteredMonthApointments] = useState([]);

  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { commonStore: { setNotification } } = useStore();

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
      render: ({ appointmentDate }) => formatFrenchDate(utcDate(appointmentDate)),
      sortable: true,
      sort: (a, b) => sortAppointmentsByDate(a, b),
    },
    {
      name: 'badge',
      label: '',
      render: appointment => <Badges badges={appointment.badges} univYear={appointment.univYear} />,
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
      render: ({ firstNames, lastName }) => `${firstNames} ${lastName}`,
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
              <b>8 séances maximum</b>
              {' '}
              prises en charge par étudiant par année universitaire
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
