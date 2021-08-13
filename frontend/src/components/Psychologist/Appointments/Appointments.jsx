import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Button, Table } from '@dataesr/react-dsfr';

import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth } from 'services/date';

import { useStore } from 'stores/';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    agent.Appointment.get()
      .then(response => {
        setAppointments(response);
      });
  }, []);

  const deleteAppointment = appointmentId => {
    setNotification({});
    agent.Appointment.delete(appointmentId).then(response => {
      setNotification(response);
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    return appointmentDate.getFullYear() === month.year
        && appointmentDate.getMonth() === month.month - 1;
  });

  const columns = [
    { name: 'date', label: 'Date', render: ({ appointmentDate }) => formatFrenchDate(new Date(appointmentDate)) },
    { name: 'student', label: 'Étudiant', render: ({ firstNames, lastName }) => `${firstNames} ${lastName}` },
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
            className="fr-fi-delete-line fr-displayed-xs fr-hidden-sm fr-float-right"
            aria-label="Supprimer"
          />
          <Button
            data-test-id="delete-appointment-button-large"
            secondary
            size="sm"
            onClick={() => deleteAppointment(appointment.id)}
            className="fr-fi-delete-line fr-btn--icon-left fr-hidden-xs fr-displayed-sm fr-float-right"
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="fr-my-2w">
        <HashLink
          to="/psychologue/nouvelle-seance"
          className="fr-btn fr-fi-add-line fr-btn--icon-left"
        >
          <div data-test-id="new-appointment-button">
            Nouvelle séance
          </div>
        </HashLink>
      </div>
      <div className="fr-mb-2w">
        Veuillez trouver ci-dessous vos séances déclarées pour le mois sélectionné :
        <div className="fr-mt-1w">
          <MonthPicker month={month} setMonth={setMonth} />
        </div>
      </div>
      {filteredAppointments.length > 0 ? (
        <Table
          data-test-id="appointments-table"
          columns={columns}
          data={filteredAppointments}
          rowKey="id"
        />
      ) : (
        <div>
          Vous n‘avez pas déclaré de séances pour le mois de
          {' '}
          { formatMonth(month) }
          .
        </div>
      )}
    </>
  );
};

export default Appointments;
