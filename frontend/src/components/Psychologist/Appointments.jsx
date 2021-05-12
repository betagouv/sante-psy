import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import agent from 'services/agent';

import date from 'services/date';
import { useStore } from 'stores/';

const Appointments = () => {
  const { commonStore: { config } } = useStore();
  const [appointments, setAppointments] = useState([]);

  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    agent.Appointment.get().then(response => setAppointments(response.appointments));
  }, []);

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w">
      <h1>Déclarer mes séances</h1>
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
            <a
              href="/psychologue/nouvelle-seance"
              className="fr-btn fr-fi-add-line fr-btn--icon-left"
            >
              Nouvelle séance

            </a>
          </div>
          <div className="fr-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <form id="month-form" action="/psychologue/mes-seances" method="POST">
                      <input type="hidden" name="_csrf" value="<%= _csrf  %>" />
                      <div className="fr-grid-row fr-grid-row--no-gutters">
                        <label className="fr-label fr-col-3" htmlFor="date">Date</label>
                        <input
                          className="fr-input short-input month-picker fr-col-9 fr-m-0"
                          id="date"
                          name="date"
                          value="<%= monthPicker %>"
                          required
                          autoComplete="off"
                        />
                        <input
                          type="text"
                          id="isoDate"
                          name="isoDate"
                          required
                          aria-hidden="true"
                          hidden
                          autoComplete="off"
                        />
                      </div>
                    </form>
                  </th>
                  <th scope="col">
                    Patient
                  </th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter(appointment => date.isSameMonth(new Date(appointment.appointmentDate), month))
                  .map(appointment => (
                    <tr key={appointment.id}>
                      <td>
                        {date.formatFrenchDate(new Date(appointment.appointmentDate))}
                      </td>
                      <td>
                        {`${appointment.firstNames} ${appointment.lastName}`}
                      </td>
                      <td>
                        <form action="/psychologue/api/supprimer-seance" method="POST">
                          <input type="hidden" name="_csrf" value="<%= _csrf  %>" />
                          <input hidden name="appointmentId" value="<%= appointment.id %>" />
                          <button
                            type="submit"
                            className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-delete-line fr-displayed-xs fr-hidden-sm fr-float-right"
                          />
                          <button
                            type="submit"
                            className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-delete-line fr-btn--icon-left fr-hidden-xs fr-displayed-sm fr-float-right"
                          >
                            Supprimer
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {appointments.length === 0 && <span>Vous n‘avez pas déclaré de séances pour ce mois.</span>}
          </div>
        </div>
      </div>
      <div className="fr-my-4w">
        Des questions ? Une difficulté ? Envoyez-nous un email à
        {' '}
        <b>{config.contactEmail}</b>
      </div>
    </div>
  );
};

export default observer(Appointments);
