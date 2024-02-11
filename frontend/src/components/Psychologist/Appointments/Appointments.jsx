import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Button, Table, Callout, CalloutText, Icon, Badge } from '@dataesr/react-dsfr';

import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth, utcDate, getUnivYear } from 'services/date';
import appointmentBadges from 'src/utils/badges';

import { useStore } from 'stores/';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    agent.Appointment.get({ includeBadges: true })
      .then(response => {
        console.log('DEBUG - appointmentsWithBadges response : ', response);
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
    console.log('DEBUG - in filter');
    const appointmentDate = utcDate(appointment.appointmentDate);
    return appointmentDate.getFullYear() === month.year
      && appointmentDate.getMonth() === month.month - 1;
  });

  const generateBadgeStyles = (badge, appointmentDate) => {
    console.log('DEBUG - generateBadgeStyles');
    let univYear = null;
    if (badge === appointmentBadges.exceeded) {
      univYear = getUnivYear(appointmentDate);
    }
    const badgeStyles = {
      first: {
        text: '1re séance',
        severity: 'info',
        icon: 'fr-icon-info-fill fr-icon--sm',
      },
      max: {
        text: 'Maximum de séances atteint',
        severity: 'warning',
        icon: 'fr-icon-warning-fill fr-icon--sm',
      },
      exceeded: {
        text: `Excès de séances ${univYear}`,
        severity: 'warning',
        icon: 'fr-icon-warning-fill fr-icon--sm',
      },
    };
    return badgeStyles[badge];
  };

  const renderBadge = ({ badge, appointmentDate }) => {
    if (!badge || badge === appointmentBadges.other) {
      return null;
    }
    console.log('DEBUG - renderBadge');
    const { icon, text, severity } = generateBadgeStyles(badge, appointmentDate);

    return (
      <Badge
        icon={icon}
        text={text}
        type={severity}
      />
    );
  };

  const columns = [
    { name: 'date', label: 'Date', render: ({ appointmentDate }) => formatFrenchDate(utcDate(appointmentDate)) },
    {
      name: 'badge',
      label: '',
      render: renderBadge,
    },
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
            {formatMonth(month)}
            .
          </div>
        )}
      </div>
    </>
  );
};

export default Appointments;
