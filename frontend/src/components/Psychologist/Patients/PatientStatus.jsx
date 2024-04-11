import React from 'react';
import renderBadge from 'components/Badges/generateBadges';
import useScreenSize from 'src/utils/useScreenSize';
import styles from './patientStatus.cssmodule.scss';
import allBadges from 'src/utils/badges';

const PatientStatus = ({ patient }) => {
  const { missingInfo, hasReachedMaxAppointment, hasTooMuchAppointment, currentYear } = patient;
  const { missingStudentInfo, missingPrescriptionInfo } = missingInfo;
  const isSmallScreen = useScreenSize();
  const badges = allBadges();
  const isCompleted = !missingPrescriptionInfo && !missingStudentInfo && !hasTooMuchAppointment;

  return (
    <div className={styles.badgeWrapper} data-test-id="etudiant-badges">
      {missingStudentInfo && renderBadge({ badge: badges.student_infos.key, isSmallScreen })}
      {missingPrescriptionInfo && renderBadge({ badge: badges.prescription_infos.key, isSmallScreen })}
      {hasReachedMaxAppointment && renderBadge({ badge: badges.max.key, isSmallScreen })}
      {hasTooMuchAppointment && renderBadge({ badge: badges.exceeded.key, univYear: currentYear, isSmallScreen })}
      {isCompleted && renderBadge({ badge: badges.completed.key, isSmallScreen })}
    </div>
  );
};

export default PatientStatus;
