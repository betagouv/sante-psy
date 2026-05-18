import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { formatDDMMYYYY } from 'services/date';
import agent from 'services/agent';

import { renderBadge } from 'components/Badges/Badges';
import getBadgeInfos from 'src/utils/badges';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import styles from './seePatient.cssmodule.scss';
import PatientAppointments from './PatientAppointments';

const SeePatient = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState();
  const badges = getBadgeInfos();

  useEffect(() => {
    if (patientId) {
      agent.Patient.getOne(patientId).then((response) => {
        setPatient({
          ...response,
          dateOfBirth: response.dateOfBirth
            ? formatDDMMYYYY(new Date(response.dateOfBirth))
            : '',
        });
      });
    } else {
      setPatient({
        INE: '',
        dateOfBirth: '',
        badges: [],
      });
    }
  }, [patientId]);

  return (
    <div className="fr-my-2w">
      <ScrollToTop loading={!!patient} />
      {patient && (
        <>
          {patientId && (
            <section
              id="anchor-student-file"
              className={styles.studentSectionTitle}
            >
              <h2>
                {patient.firstNames} {patient.lastName}
              </h2>
              {patient.badges.includes(badges.student_ine.key)
                ? renderBadge({ badge: badges.student_ine.key })
                : ''}
            </section>
          )}
          <div>
            {patientId && (
              <div
                id="anchor-student-list"
                className={styles.patientAppointments}
              >
                <PatientAppointments patientId={patientId} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SeePatient;
