import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Tabs, Tab, Button, Icon } from '@dataesr/react-dsfr';
import agent from 'services/agent';
import { useStore } from 'stores/';
import Badges from 'components/Badges/Badges';
import useScreenSize from 'src/utils/useScreenSize';
import { useNavigate } from 'react-router-dom';
import { currentUnivYear } from 'services/date';
import getBadgeInfos from 'src/utils/badges';
import styles from './patientAppointments.cssmodule.scss';

const PatientAppointments = ({ showCreateButton = true, patientId }) => {
  const { commonStore: { setNotification } } = useStore();

  const [patientAppointments, setPatientAppointments] = useState({});
  const [dataWithIndex, setDataWithIndex] = useState([]);
  const [univYears, setUnivYears] = useState([]);
  const currentYear = currentUnivYear('-');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showTooltip, setShowTooltip] = useState(null);

  const isSmallScreen = useScreenSize();
  const navigate = useNavigate();
  const badges = getBadgeInfos();

  useEffect(() => {
    if (patientId) {
      agent.Appointment.getByPatientId(patientId)
        .then(response => {
          const years = Object.keys(response).reverse();
          setPatientAppointments(response);
          setUnivYears(years);

          if (!years.includes(currentYear)) {
            setSelectedYear(years[0]);
          }
        });
    }
  }, [patientId]);

  useEffect(() => {
    if (selectedYear && patientAppointments[selectedYear]) {
      const originalArray = patientAppointments[selectedYear];
      const reversedArray = originalArray.slice().reverse();

      let lastIndex = 0;
      const indexedArray = reversedArray.map(item => {
        const currentIndex = item.badges.includes(badges.inactive.key) && item.badges.includes(badges.exceeded.key) ? '-' : ++lastIndex;
        return { ...item, index: currentIndex };
      });

      // Restaurer l'ordre original
      const originalOrderIndexedArray = indexedArray.slice().reverse();

      setDataWithIndex(originalOrderIndexedArray);
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

  const renderDeclareSessionButton = () => showCreateButton && (
  <Button
    className={isSmallScreen ? styles.smallCreateButton : styles.createButton}
    icon="ri-add-line"
    size="sm"
    onClick={() => navigate(`/psychologue/nouvelle-seance/${patientId}`)}
      >
    Déclarer une séance
  </Button>
  );

  const handleIconClick = id => {
    if (showTooltip === id) {
      setShowTooltip(null);
    } else {
      setShowTooltip(id);
    }
  };

  const renderRow = appointment => {
    const isInactive = appointment.badges && appointment.badges.includes(badges.inactive.key);
    const isInactiveRow = isInactive && appointment.badges.includes(badges.exceeded.key);
    const rowClass = isInactiveRow ? styles.grayedRow : '';

    return (
      <tr key={appointment.id} className={rowClass}>
        <td>{appointment.index}</td>
        <td className={styles.date}>
          <div>{new Date(appointment.appointmentDate).toLocaleDateString()}</div>
          {appointment.badges.includes(badges.switch_rule_notice.key)
            && (
            <div
              className={styles.clickableElement}
              onClick={() => handleIconClick(appointment.id)}
            >
              <Icon
                name="ri-information-line"
                size="lg"
                color="#000091"
                iconPosition="right"

              />
              {showTooltip === appointment.id && (
              <span className={styles.tooltip}>
                {badges.switch_rule_notice.tooltip}
              </span>
              )}
            </div>
            )}
        </td>
        <td data-column="badges">
          <Badges badges={appointment.badges} univYear={selectedYear} />
        </td>
        <td>
          <Button
            data-test-id="delete-appointment-button-small"
            onClick={() => deleteAppointment(appointment.id)}
            secondary
            size="sm"
            icon="ri-delete-bin-line"
            className="fr-float-right"
            aria-label="Supprimer"
            disabled={appointment.badges && appointment.badges.includes(badges.other_psychologist.key)}
          />
        </td>
      </tr>
    );
  };

  const renderTable = () => (
    <div className={`${'fr-table fr-table--bordered'} ${styles.tableAppointments}`}>
      <table>
        <thead>
          <tr>
            <th scope="col">n°</th>
            <th scope="col">Dates des séances effectuées</th>
            {/* <th scope="col" className={styles.notice}>
                  <span className="fr-hidden">Notice</span>
                </th> */}
            <th scope="col">
              <span className="fr-hidden">Badges</span>
            </th>
            <th scope="col">
              <span className="fr-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {dataWithIndex.map(appointment => renderRow(appointment))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div data-test-id="etudiant-seances-list">
      {dataWithIndex.length > 0 ? (
        <>
          {isSmallScreen && renderDeclareSessionButton()}
          <h3 className={styles.title}>Séances</h3>
          <div className={!isSmallScreen ? styles.tabsContainer : ''}>
            <Tabs
              defaultActiveTab={univYears.indexOf(selectedYear)}
              onChange={handleTabChange}
              className={styles.tabs}
        >
              {univYears.map((univYear, index) => (
                <Tab
                  key={univYear}
                  id={univYear}
                  label={univYear}
                  index={index}
                  isActive={selectedYear === univYear}
                  className={styles.tabYear}
                />
              ))}
            </Tabs>
            {!isSmallScreen && renderDeclareSessionButton()}
          </div>
          {selectedYear && renderTable()}
        </>
      ) : (
        <div className={styles.noAppointmentsWrapper}>
          <h3 className={styles.noAppointmentsTitle}>Pas de séances déclarées</h3>
          {renderDeclareSessionButton()}
        </div>
      )}
    </div>
  );
};

export default observer(PatientAppointments);
