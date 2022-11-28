import React from 'react';
import { Tag } from '@dataesr/react-dsfr';

import classNames from 'classnames';
import styles from './patientStatus.cssmodule.scss';

const PatientStatus = ({ hasFolderCompleted, missingInfo }) => (
  <>
    <div className="fr-col-2 fr-col-md-1 fr-unhidden fr-hidden-sm">
      <Tag
        className={classNames(hasFolderCompleted ? styles.complete : styles.incomplete, styles.small)}
        icon={hasFolderCompleted ? 'ri-check-line' : 'ri-alert-line'}
        iconPosition="left"
        size="sm"
        as="span"
      />
    </div>
    <div className="fr-col-4 fr-col-xl-5 fr-hidden fr-unhidden-sm">
      <Tag
        data-test-id={hasFolderCompleted ? 'etudiant-row-complete-info' : 'etudiant-row-missing-info'}
        className={classNames(hasFolderCompleted ? styles.complete : styles.incomplete, styles.big)}
        icon={hasFolderCompleted ? 'ri-check-line' : 'ri-alert-line'}
        iconPosition="left"
        size="sm"
        as="span"
      >
        {hasFolderCompleted
          ? 'Dossier complet'
          : `Informations manquantes : ${missingInfo.join(', ')}`}
      </Tag>
    </div>
  </>
);

export default PatientStatus;
