import React from 'react';

import { formatDDMMYYYY } from 'services/date';

const BillingTable = ({ filteredDate, appointments }) => (
  <div className="fr-table fr-mb-2w">
    <table>
      <caption>Tableau récapitulatif </caption>
      <thead>
        <tr>
          <th scope="col">Date des séances effectuées</th>
          <th scope="col">Nombre de séances réalisées</th>
          <th scope="col">Total TTC €</th>
        </tr>
      </thead>
      <tbody>
        {filteredDate.map(date => {
          const appointment = appointments[date];
          return (
            <tr data-test-id="billing-row" key={date}>
              <td>{formatDDMMYYYY(new Date(date))}</td>
              <td>{appointment}</td>
              <td>{`${appointment * 30}€`}</td>
            </tr>
          );
        })}
        <tr data-test-id="billing-row">
          <td>Total</td>
          <td>{filteredDate.reduce((accumulator, date) => accumulator + appointments[date], 0)}</td>
          <td>{`${filteredDate.reduce((accumulator, date) => accumulator + appointments[date], 0) * 30}€`}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default BillingTable;
