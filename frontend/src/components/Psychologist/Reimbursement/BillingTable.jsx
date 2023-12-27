import { Table } from '@dataesr/react-dsfr';
import React from 'react';

import { formatDDMMYYYY, utcDate } from 'services/date';
import billingDataService from 'services/billingData';

const FIRST_APPOINTMENT_TTC = 40;
const NEXT_APPOINTMENT_TTC = 30;

const boldContent = content => (
  <div style={{ fontWeight: 'bold' }}>
    {content}
  </div>
);

const BillingTable = ({ filteredFirstDates, firstAppointments, filteredDates, appointments }) => {
  const totalAppointments = billingDataService.getTotal(filteredDates, appointments);
  const totalFirstAppointments = billingDataService.getTotal(filteredFirstDates, firstAppointments);

  const columns = [
    {
      name: 'date',
      label: 'Date des séances effectuées',
      render: date => (date === 'total' ? boldContent('Total') : formatDDMMYYYY(utcDate(date))),
    },
    {
      name: 'appointment',
      label: 'Nombre de séances réalisées',
      render: date => (date === 'total' ? boldContent(totalAppointments) : appointments[date]),
    },
    {
      name: 'firstAppointment',
      label: 'Dont premières séances',
      render: date => (date === 'total' ? boldContent(totalFirstAppointments) : firstAppointments[date] || 0),
    },
    {
      name: 'total',
      label: 'Total TTC €',
      render: date => {
        let nbAppointments = 0;
        let nbFirstAppointments = 0;
        if (date === 'total') {
          nbFirstAppointments = totalFirstAppointments;
          nbAppointments = totalAppointments;
        } else {
          nbFirstAppointments = firstAppointments[date] || 0;
          nbAppointments = appointments[date];
        }

        const totalAmountAppointments = (nbAppointments - nbFirstAppointments) * NEXT_APPOINTMENT_TTC;
        const totalAmountFirstAppointments = nbFirstAppointments * FIRST_APPOINTMENT_TTC;
        const totalAmount = `${totalAmountAppointments + totalAmountFirstAppointments}€`;

        return date === 'total' ? boldContent(totalAmount) : totalAmount;
      },
    },
  ];

  return (
    <Table
      id="billing-table"
      data-test-id="billing-table"
      caption="Tableau récapitulatif"
      columns={columns}
      data={filteredDates.concat(['total'])}
      rowKey={x => x}
      />
  );
};

export default BillingTable;
