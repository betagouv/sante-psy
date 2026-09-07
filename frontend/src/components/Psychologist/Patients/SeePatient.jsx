import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { formatDDMMYYYY } from 'services/date';
import agent from 'services/agent';

import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import styles from './seePatient.cssmodule.scss';
import PatientAppointments from './PatientAppointments';
import NewAppointmentSeeCertificate from '../Appointments/NewAppointmentSeeCertificate';
import { getUnivYear } from 'services/univYears';
import PatientStatus from './PatientStatus';
import { Stack } from 'components/Utils/Stack';

const SeePatient = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState();

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
            </section>
          )}
          <Stack>
            {patient && <PatientStatus patient={patient} />}
            {patient?.student?.eligibility?.isProfileComplete && (
              <>
                <h4>
                  Justificatif pour l'année {getUnivYear(new Date(), '-')}
                </h4>
                <NewAppointmentSeeCertificate
                  studentId={patient.student.id}
                  univYear={getUnivYear(new Date(), '-')}
                  className={styles.certificatePreview}
                />
              </>
            )}

            {patientId && (
              <div
                id="anchor-student-list"
                className={styles.patientAppointments}
              >
                <PatientAppointments patientId={patientId} />
              </div>
            )}
          </Stack>
        </>
      )}
    </div>
  );
};

export default SeePatient;
