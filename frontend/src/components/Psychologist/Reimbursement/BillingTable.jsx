import { Table } from '@dataesr/react-dsfr';
import React from 'react';

import { formatDDMMYYYY, utcDate } from 'services/date';
import billingDataService from 'services/billingData';
import getBadgeInfos from 'src/utils/badges';

const FIRST_APPOINTMENT_TTC = 40;
const NEXT_APPOINTMENT_TTC = 30;

const NEW_RULES_APPOINTMENT_TTC = 50;

const boldContent = content => (
  <div style={{ fontWeight: 'bold' }}>
    {content}
  </div>
);

const getTotalForAllBadges = (appointments, date) => {
  let total = 0;
  for (const badge in appointments[date]) {
    total += appointments[date][badge];
  }
  return total;
};

const BillingTable = ({ filteredDates, appointments }) => {
  const totalAppointmentsByBadges = billingDataService.getTotalForAllBadges(filteredDates, appointments);
  const totalAllBadges = Object.values(totalAppointmentsByBadges).reduce((total, value) => total + value, 0);
  const badges = getBadgeInfos();

  const columns = [
    {
      name: 'date',
      label: 'Date des séances effectuées',
      render: date => (date === 'total' ? boldContent('Total') : formatDDMMYYYY(utcDate(date))),
    },
    {
      name: 'appointment',
      label: 'Nombre de séances réalisées',
      render: date => (date === 'total' ? boldContent(totalAllBadges) : getTotalForAllBadges(appointments, date)),
    },
    {
      name: 'firstAppointment',
      label: 'Dont premières séances',
      render: date => (date === 'total' ? boldContent(totalAppointmentsByBadges[badges.first.key]) : appointments[date][badges.first.key] || 0),
    },
    {
      name: 'total',
      label: 'Total TTC €',
      render: date => {
        let nbAppointments = 0;
        let nbFirstAppointments = 0;
        let nbNewRulesAppointments = 0;

        if (date === 'total') {
          nbFirstAppointments = totalAppointmentsByBadges[badges.first.key];
          nbAppointments = totalAppointmentsByBadges[badges.other.key];
          nbNewRulesAppointments = totalAppointmentsByBadges[badges.new_rules.key];
        } else {
          nbFirstAppointments = appointments[date][badges.first.key] || 0;
          nbAppointments = appointments[date][badges.other.key] || 0;
          nbNewRulesAppointments = appointments[date][badges.new_rules.key] || 0;
        }

        const totalAmountAppointments = (nbAppointments * NEXT_APPOINTMENT_TTC) + (nbNewRulesAppointments * NEW_RULES_APPOINTMENT_TTC);
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
