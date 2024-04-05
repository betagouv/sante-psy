import React from 'react';
import renderBadge from 'components/Badges/generateBadges';
import useScreenSize from 'src/utils/useScreenSize';
import styles from './patientStatus.cssmodule.scss';

const PatientStatus = ({ missingInfo, hasReachedMaxAppointment, hasTooMuchAppointment, currentYear }) => {
  const isSmallScreen = useScreenSize();
  const isCompleted = !missingInfo.missingPrescriptionInfo && !missingInfo.missingStudentInfo && !hasTooMuchAppointment;

  return (
    <div className={styles.badgeWrapper} data-test-id="etudiant-badges">
      {missingInfo.missingStudentInfo && renderBadge({ badge: 'student_infos', isSmallScreen })}
      {missingInfo.missingPrescriptionInfo && renderBadge({ badge: 'prescription_infos', isSmallScreen })}
      {hasReachedMaxAppointment && renderBadge({ badge: 'max', isSmallScreen })}
      {hasTooMuchAppointment && renderBadge({ badge: 'exceeded', appointmentDate: currentYear, isSmallScreen })}
      {isCompleted && renderBadge({ badge: 'completed', isSmallScreen })}
    </div>
  );
};

export default PatientStatus;
