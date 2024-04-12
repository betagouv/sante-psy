import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Table, Tabs, Tab, Callout, CalloutText, Icon } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { currentUnivYear, parseDateForm } from 'services/date';
import { useStore } from 'stores/';
import renderBadge from 'components/Badges/generateBadges';
import { MAX_APPOINTMENT } from '../Appointments/NewAppointment';

import PatientActionsLegend from './PatientActionsLegend';
import PatientActions from './PatientActions';
import PatientStatus from './PatientStatus';
import styles from './patients.cssmodule.scss';

const PatientAppointments = ({ patientId }) => {
  const { commonStore: { config, setNotification } } = useStore();
  const currentYear = currentUnivYear();
  const [patientAppointments, setPatientAppointments] = useState({});
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const univYears = Object.keys(patientAppointments).reverse();

  useEffect(() => {
    console.log('currentYear : ', selectedYear);
    if (patientId) {
      agent.Appointment.getByPatientId(patientId)
        .then(response => {
          console.log('response : ', response);
          setPatientAppointments(response);
        });
    }
  }, [patientId]);

  const handleTabChange = index => {
    setSelectedTabIndex(index);
  };


  const selectedYear = univYears[selectedTabIndex];
  const dataWithIndex = selectedYear ? patientAppointments[selectedYear].map((item, index) => ({ ...item, index: patientAppointments[selectedYear].length - index })) : [];

  const columns = [
    {
      name: 'number',
      label: 'n°',
      render: (appointment) => appointment.index, // Utilisez l'index de la fonction de rendu de la colonne
    },
    {
      name: 'date',
      label: 'Date du rendez-vous',
      render: appointment => new Date(appointment.appointmentDate).toLocaleDateString(),
    },
    {
      name: 'status',
      label: 'Dates des séances effectuées',
      render: appointment => appointment.badges.map(badge => renderBadge({ badge })),
      sortable: true,
      sort: (a, b) => a.missingInfo.length - b.missingInfo.length,
    },
  ];

  return (
    <>
      <Tabs
        onChange={handleTabChange}
      >
        {univYears.map(univYear => (
          <Tab
            key={univYear}
            id={univYear}
            label={univYear}
            isActive={selectedYear === univYear}
          />
        ))}
      </Tabs>
      {selectedYear && (
        <Table
          data-test-id="etudiant-table"
          columns={columns}
          data={dataWithIndex}
          fixedHeader={true}
          noScroll={dataWithIndex.length <= 8}
          rowKey={x => x}
          className={styles.tableAppointments}
        />
      )}
    </>
  );
};

export default observer(PatientAppointments);
