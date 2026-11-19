import React from 'react';
import { Table } from '@codegouvfr/react-dsfr/Table';

import { formatDDMMYYYY, utcDate } from 'services/date';
import billingDataService from 'services/billingData';

const APPOINTMENT_TTC = 50;

const boldContent = (content) => (
  <div style={{ fontWeight: 'bold' }}>{content}</div>
);

const getTotalForAllBadges = (appointments, date) => {
  let total = 0;
  for (const badge in appointments[date]) {
    total += appointments[date][badge];
  }
  return total;
};

const BillingTable = ({ filteredDates, appointments }) => {
  const totalAppointmentsByBadges = billingDataService.getTotalForAllBadges(
    filteredDates,
    appointments,
  );
  const totalAllBadges = Object.values(totalAppointmentsByBadges).reduce(
    (total, value) => total + value,
    0,
  );

  const columns = [
    {
      name: 'date',
      label: 'Date des séances effectuées',
      render: (date) =>
        date === 'total' ? boldContent('Total') : formatDDMMYYYY(utcDate(date)),
    },
    {
      name: 'appointment',
      label: 'Nombre de séances réalisées',
      render: (date) =>
        date === 'total'
          ? boldContent(totalAllBadges)
          : getTotalForAllBadges(appointments, date),
    },
    {
      name: 'total',
      label: 'Total TTC €',
      render: (date) => {
        const nbAppointments =
          date === 'total'
            ? totalAllBadges
            : getTotalForAllBadges(appointments, date) || 0;

        const totalAmountAppointments = nbAppointments * APPOINTMENT_TTC;
        const totalAmount = `${totalAmountAppointments}€`;

        return date === 'total' ? boldContent(totalAmount) : totalAmount;
      },
    },
  ];

  const tableData = filteredDates.concat(['total']);

  return (
    <Table
      id="billing-table"
      caption="Tableau récapitulatif"
      headers={columns.map((column) => column.label)}
      data={tableData.map((date) =>
        columns.map((column) => column.render(date)),
      )}
    />
  );
};

export default BillingTable;
