import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Button, Table, Callout, CalloutText, Icon } from '@dataesr/react-dsfr';

import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth, utcDate } from 'services/date';

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
    const appointmentDate = utcDate(appointment.appointmentDate);
    return appointmentDate.getFullYear() === month.year
        && appointmentDate.getMonth() === month.month - 1;
  });

  const columns = [
    { name: 'date', label: 'Date', render: ({ appointmentDate }) => formatFrenchDate(utcDate(appointmentDate)) },
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
            Le dispositif Santé Psy Étudiant est reconduit sur l&lsquo;année universitaire 2022/2023.
          </span>
          <br />
          Dans cette période de transition vers un dispositif de droit commun, le renouvellement d&lsquo;un cycle de 8 séances est autorisé à partir de septembre 2022.
          {' '}
          <br />
          <br />
          <br />
          Nous vous invitons à vérifier l&lsquo;exactitude de vos déclarations afin d&lsquo;éviter tout délai de remboursement supplémentaire.
        </CalloutText>
      </Callout>
      <div className="fr-my-2w">
        <HashLink
          id="new-appointment-button"
          to="/psychologue/nouvelle-seance"
          className="fr-btn"
        >
          <div data-test-id="new-appointment-button">
            <Icon size="md" name="ri-add-line" />
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
      </div>
    </>
  );
};

export default Appointments;
