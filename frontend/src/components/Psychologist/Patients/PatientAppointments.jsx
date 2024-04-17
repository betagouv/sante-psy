import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Table, Tabs, Tab, Button } from '@dataesr/react-dsfr';
import agent from 'services/agent';
import { useStore } from 'stores/';
import Badges from 'components/Badges/Badges';
import useScreenSize from 'src/utils/useScreenSize';
import { useNavigate } from 'react-router-dom';
import styles from './patientAppointments.cssmodule.scss';

const PatientAppointments = ({ showCreateButton = true, patientId }) => {
  const { commonStore: { setNotification } } = useStore();
  const [patientAppointments, setPatientAppointments] = useState({});
  const [dataWithIndex, setDataWithIndex] = useState([]);
  const [univYears, setUnivYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(univYears[0]);
  const isSmallScreen = useScreenSize();
  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      agent.Appointment.getByPatientId(patientId)
        .then(response => {
          const years = Object.keys(response).reverse();
          setPatientAppointments(response);
          setUnivYears(Object.keys(response).reverse());
          setSelectedYear(years[0]);
        });
    }
  }, [patientId]);

  useEffect(() => {
    if (selectedYear && patientAppointments[selectedYear]) {
      const newDataWithIndex = patientAppointments[selectedYear].map((item, index) => ({ ...item, index: patientAppointments[selectedYear].length - index }));
      setDataWithIndex(newDataWithIndex);
    } else {
      setDataWithIndex([]);
    }
  }, [patientAppointments, selectedYear]);

  const handleTabChange = index => {
    setSelectedYear(univYears[index]);
  };

  const deleteAppointment = appointmentId => {
    setNotification({});
    agent.Appointment.delete(appointmentId).then(response => {
      setNotification(response);
      setPatientAppointments({ ...patientAppointments, [selectedYear]: patientAppointments[selectedYear].filter(appointment => appointment.id !== appointmentId) });
    });
  };

  const renderDeclareSessionButton = () => (
    <Button
      className={styles.createButton}
      icon="ri-add-line"
      size="sm"
      onClick={() => navigate('/psychologue/nouvelle-seance')}
    >
      Déclarer une séance
    </Button>
  );

  const renderTable = () => (
    <Table
      data-test-id="etudiant-seances-list"
      columns={columns}
      data={dataWithIndex}
      fixedHeader
      noScroll={dataWithIndex.length <= 8}
      rowKey={x => x}
      className={styles.tableAppointments}
    />
  );

  const columns = [
    {
      name: 'number',
      label: 'n°',
      render: appointment => appointment.index,
    },
    {
      name: 'date',
      label: 'Dates des séances effectuées',
      render: appointment => new Date(appointment.appointmentDate).toLocaleDateString(),
    },
    {
      name: 'badges',
      label: '',
      render: appointment => <Badges badges={appointment.badges} univYear={selectedYear} />,
    },
    {
      name: 'actions',
      label: '',
      render: appointment => (
        <Button
          data-test-id="delete-appointment-button-small"
          onClick={() => deleteAppointment(appointment.id)}
          secondary
          size="sm"
          icon="ri-delete-bin-line"
          className="fr-float-right"
          aria-label="Supprimer"
          disabled={appointment.badges && appointment.badges.includes('other_psychologist')}
          />
      ),
    },
  ];

  return (
    <div data-test-id="etudiant-seances-list">
      {dataWithIndex.length > 0 ? (
        <>
          {isSmallScreen && showCreateButton && (
          <Button
            className={styles.smallCreateButton}
            icon="ri-add-line"
            size="sm"
            onClick={() => navigate('/psychologue/nouvelle-seance')}
        >
            Déclarer une séance
          </Button>
          )}
          <h3 className={styles.title}>Séances</h3>
          <div className={!isSmallScreen ? styles.tabsContainer : ''}>
            <Tabs
              onChange={handleTabChange}
              className={styles.tabs}
        >
              {univYears.map(univYear => (
                <Tab
                  key={univYear}
                  id={univYear}
                  label={univYear}
                  isActive={selectedYear === univYear}
                  className={styles.tabYear}
            />
              ))}
            </Tabs>
            {!isSmallScreen && showCreateButton && renderDeclareSessionButton()}
          </div>
          {selectedYear && renderTable()}
        </>
      ) : (
        <div className={styles.noAppointmentsWrapper}>
          <h3 className={styles.noAppointmentsTitle}>Pas de séances déclarées</h3>
          {showCreateButton && renderDeclareSessionButton()}
        </div>
      )}
    </div>
  );
};

export default observer(PatientAppointments);
