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

const pickerLang = { months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'] };

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [convention, setConvention] = useState();
  const calendar = useRef(null);

  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    agent.Appointment.get()
      .then(response => {
        setLoading(false);
        setAppointments(response.appointments);
        setConvention(response.currentConvention);
        if (!response.success) {
          setNotification(response);
        }
      });
  }, []);

  const deleteAppointment = appointmentId => {
    setNotification({});
    agent.Appointment.delete(appointmentId).then(response => {
      if (response.success) {
        setNotification(response);
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      } else {
        setNotification(response);
      }
    });
  };

  const makeText = m => {
    if (m && m.year && m.month) return (`${pickerLang.months[m.month - 1]}. ${m.year}`);
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
      <Notification success>
        Veuillez indiquer l&lsquo;état de votre conventionnement sur la page
        {' '}
        <HashLink to="/psychologue/mes-remboursements">Remboursement de mes séances</HashLink>
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
          <div className={classNames('fr-table', styles.table)}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <Picker
                      years={{ min: { year: 2021, month: 3 }, max: { year: 2022, month: 12 } }}
                      ref={calendar}
                      value={month}
                      lang={pickerLang.months}
                      onChange={(y, m) => { setMonth({ month: m, year: y }); calendar.current.dismiss(); }}
                    >
                      <div className="fr-grid-row fr-grid-row--middle fr-grid-row--no-gutters">
                        <label className="fr-label fr-col-3" htmlFor="date">Date</label>
                        <input
                          className="fr-input short-input"
                          onChange={() => {}}
                          onClick={() => calendar.current.show()}
                          value={makeText(month)}
                        />
                      </div>
                    </Picker>
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
                  <tr key={appointment.id}>
                    <td>
                      {date.formatFrenchDate(new Date(appointment.appointmentDate))}
                    </td>
                    <td>
                      {`${appointment.firstNames} ${appointment.lastName}`}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        type="button"
                        className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-delete-line fr-displayed-xs fr-hidden-sm fr-float-right"
                        aria-label="Supprimer"
                      />
                      <button
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
            {filteredAppointments.length === 0 && <span>Vous n‘avez pas déclaré de séances pour ce mois.</span>}
          </div>
        </div>
      </div>
      <Mail />
    </div>
  );
};

export default observer(Appointments);
