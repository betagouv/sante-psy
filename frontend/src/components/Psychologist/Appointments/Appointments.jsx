import React, { useEffect, useState, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';
import Picker from 'react-month-picker';
import classNames from 'classnames';

import Notification from 'components/Notification/Notification';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';

import agent from 'services/agent';
import date from 'services/date';

import { useStore } from 'stores/';

import styles from './appointments.cssmodule.scss';
import 'react-month-picker/css/month-picker.css';
import './custom-month-picker.css';

const shortPickerLang = { months: date.shortFrenchMonthNames };
const longPickerLang = { months: date.longFrenchMonthNames };

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [convention, setConvention] = useState();
  const calendar = useRef(null);

  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { commonStore: { setNotification }, userStore: { user } } = useStore();

  useEffect(() => {
    agent.Appointment.get()
      .then(response => {
        setLoading(false);
        setAppointments(response.appointments);
        setConvention(response.currentConvention);
      });
  }, []);

  const deleteAppointment = appointmentId => {
    setNotification({});
    agent.Appointment.delete(appointmentId).then(response => {
      setNotification(response);
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    });
  };

  const makeText = m => {
    if (m && m.year && m.month) return (`${longPickerLang.months[m.month - 1]} ${m.year}`);
    return '?';
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    return appointmentDate.getFullYear() === month.year
        && appointmentDate.getMonth() === month.month - 1;
  });

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w">
      {!loading && (!convention || !convention.universityId) && (
      <Notification>
        Veuillez indiquer l&lsquo;état de votre conventionnement sur la page
        {' '}
        <HashLink to="/psychologue/mes-remboursements">Remboursement de mes séances</HashLink>
      </Notification>
      )}
      {!loading && user && !user.active && (
      <Notification>
        Votre compte est supsendu. Pour que les étudiants puisse vous contacter, rendez vous sur
        {' '}
        <HashLink to="/psychologue/mon-profil">votre profil</HashLink>
      </Notification>
      )}
      <h1>Déclarer mes séances</h1>
      <GlobalNotification />
      <div className="fr-mb-1w">
        <div>
          Afin que nous puissions vous rembourser les séances réalisées, nous vous proposons de nous les
          indiquer sur ce site.
        </div>
      </div>
      <div className="fr-grid-row fr-grid-row--left fr-grid-row--gutters">
        <div className="fr-col-12">
          <h2 className="fr-mb-2w">
            Mes séances
          </h2>
          <div className="fr-mb-2w">
            <HashLink
              to="/psychologue/nouvelle-seance"
              className="fr-btn fr-fi-add-line fr-btn--icon-left"
            >
              Nouvelle séance
            </HashLink>
          </div>
          <div className="fr-mb-1w">
            <div className="fr-grid-row fr-grid-row--middle fr-grid-row--no-gutters">
              <label className="fr-label fr-col-xs-10 fr-col-lg-6" htmlFor="date">
                Veuillez trouver ci-dessous vos séances déclarées pour le mois sélectionné :
              </label>
              <Picker
                years={{ min: { year: 2021, month: 3 }, max: { year: 2022, month: 12 } }}
                ref={calendar}
                value={month}
                lang={shortPickerLang.months}
                onChange={(y, m) => { setMonth({ month: m, year: y }); calendar.current.dismiss(); }}
              >
                <input
                  className="fr-input short-input"
                  onChange={() => {}}
                  onClick={() => calendar.current.show()}
                  value={makeText(month)}
                />
              </Picker>
            </div>
          </div>
          <div className={classNames('fr-table', styles.table)}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    Date
                  </th>
                  <th scope="col">
                    Patient
                  </th>
                  <th scope="col">
                    {' '}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.id} data-test-id="appointment-row">
                    <td>
                      {date.formatFrenchDate(new Date(appointment.appointmentDate))}
                    </td>
                    <td>
                      {`${appointment.firstNames} ${appointment.lastName}`}
                    </td>
                    <td>
                      <button
                        data-test-id="delete-appointment-button-small"
                        onClick={() => deleteAppointment(appointment.id)}
                        type="button"
                        className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-delete-line fr-displayed-xs fr-hidden-sm fr-float-right"
                        aria-label="Supprimer"
                      />
                      <button
                        data-test-id="delete-appointment-button-large"
                        type="button"
                        onClick={() => deleteAppointment(appointment.id)}
                        className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-delete-line fr-btn--icon-left fr-hidden-xs fr-displayed-sm fr-float-right"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAppointments.length === 0 && (
            <div className="fr-mt-2w">
              Vous n‘avez pas déclaré de séances pour le mois de
              {' '}
              { makeText(month) }
              .
            </div>
            )}
          </div>
        </div>
      </div>
      <Mail />
    </div>
  );
};

export default observer(Appointments);
