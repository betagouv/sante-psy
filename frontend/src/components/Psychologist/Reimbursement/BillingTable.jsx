import { Table } from '@dataesr/react-dsfr';
import React from 'react';

import { formatDDMMYYYY } from 'services/date';

const BillingTable = ({ filteredDate, appointments }) => {
  const columns = [
    {
      name: 'date',
      label: 'Date des séances effectuées',
      render: date => (date === 'total' ? 'Total' : formatDDMMYYYY(new Date(date))),
    },
    {
      name: 'appointment',
      label: 'Nombre de séances réalisées',
      render: date => (date === 'total'
        ? filteredDate.reduce((accumulator, d) => accumulator + appointments[d], 0)
        : appointments[date]),
    },
    {
      name: 'total',
      label: 'Total TTC €',
      render: date => (date === 'total'
        ? `${filteredDate.reduce((accumulator, d) => accumulator + appointments[d], 0) * 30}€`
        : `${appointments[date] * 30}€`),
    },
  ];
  return (
    <div id="billing-table">
      <Table
        data-test-id="billing-table"
        caption="Tableau récapitulatif"
        columns={columns}
        data={filteredDate.concat(['total'])}
        rowKey={x => x}
      />
    </div>
  );
};

export default BillingTable;
