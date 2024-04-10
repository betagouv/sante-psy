import React from 'react';
import renderBadge from 'components/Badges/generateBadges';
import useScreenSize from 'src/utils/useScreenSize';
import styles from './patientStatus.cssmodule.scss';

const PatientStatus = ({ patient }) => {
  const { missingInfo, hasReachedMaxAppointment, hasTooMuchAppointment, currentYear } = patient;
  const { missingStudentInfo, missingPrescriptionInfo } = missingInfo;
  const isSmallScreen = useScreenSize();
  const isCompleted = !missingPrescriptionInfo && !missingStudentInfo && !hasTooMuchAppointment;

  return (
    <div className={styles.badgeWrapper} data-test-id="etudiant-badges">
      {missingStudentInfo && renderBadge({ badge: 'student_infos', isSmallScreen })}
      {missingPrescriptionInfo && renderBadge({ badge: 'prescription_infos', isSmallScreen })}
      {hasReachedMaxAppointment && renderBadge({ badge: 'max', isSmallScreen })}
      {hasTooMuchAppointment && renderBadge({ badge: 'exceeded', appointmentDate: currentYear, isSmallScreen })}
      {isCompleted && renderBadge({ badge: 'completed', isSmallScreen })}
    </div>
  );
};

export default PatientStatus;
