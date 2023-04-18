import React from 'react';
import { Tag } from '@dataesr/react-dsfr';

import classNames from 'classnames';
import styles from './patientStatus.cssmodule.scss';

const PatientStatus = ({ missingInfo, hasTooMuchAppointment, currentYear }) => {
  const isOk = missingInfo.length === 0 && !hasTooMuchAppointment;

  return (
    <>
      <div className="fr-col-2 fr-col-md-1 fr-unhidden fr-hidden-sm">
        <Tag
          className={classNames(isOk ? styles.complete : styles.incomplete, styles.small)}
          icon={isOk ? 'ri-check-line' : 'ri-alert-line'}
          iconPosition="left"
          size="sm"
          as="span"
        />
      </div>
      <div className="fr-col-4 fr-col-xl-5 fr-hidden fr-unhidden-sm">
        <Tag
          data-test-id={isOk ? 'etudiant-row-complete-info' : 'etudiant-row-missing-info'}
          className={classNames(isOk ? styles.complete : styles.incomplete, styles.big)}
          icon={isOk ? 'ri-check-line' : 'ri-alert-line'}
          iconPosition="left"
          size="sm"
          as="span"
        >
          {isOk
            ? 'Dossier complet'
            : (
              <>
                {missingInfo.length !== 0 && `Informations manquantes : ${missingInfo.join(', ')}.`}
                {missingInfo.length !== 0 && hasTooMuchAppointment && <br />}
                {hasTooMuchAppointment && `Excès de séances sur ${currentYear}.`}
              </>
            )}
        </Tag>
      </div>
    </>
  );
};

export default PatientStatus;
