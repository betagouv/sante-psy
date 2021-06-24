import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import Notification from 'components/Notification/Notification';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';
import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth } from 'services/date';
import { shouldCheckConventionAgain } from 'services/conventionVerification';

import { useStore } from 'stores/';

import ConventionModal from './ConventionModal';

import styles from './appointments.cssmodule.scss';
import 'react-month-picker/css/month-picker.css';
import './custom-month-picker.css';

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

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

  const hasSignedConvention = user.convention && user.convention.isConventionSigned;
  const modal = hasSignedConvention || !shouldCheckConventionAgain()
    ? <></>
    : <ConventionModal currentConvention={user.convention} />;

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w" data-test-id="appointment-container">
      {modal}
      {!loading && (!user.convention || !user.convention.universityId) && (
      <Notification>
        Veuillez indiquer l&lsquo;état de votre conventionnement sur la page
        {' '}
        <HashLink to="/psychologue/mes-remboursements">Remboursement de mes séances</HashLink>
      </Notification>
      )}
      {!loading && user && !user.active && (
      <Notification>
        Votre profil n&lsquo;est plus visible dans l&lsquo;annuaire. Pour que les étudiants puissent vous contacter, rendez vous sur
        {' '}
        <HashLink to="/psychologue/mon-profil">votre profil</HashLink>
        .
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
                <MonthPicker month={month} setMonth={setMonth} />
              </label>
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
                      {formatFrenchDate(new Date(appointment.appointmentDate))}
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
              { formatMonth(month) }
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
