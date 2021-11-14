import React from 'react';
import classnames from 'classnames';

import UnderlinedTitle from 'components/Page/UnderlinedTitle';

import styles from './studentProcess.cssmodule.scss';
import StudentCards from './StudentCards';

const StudentProcess = () => (
  <div className={styles.container}>
    <UnderlinedTitle
      big
      backgroundColor="yellow"
      title="Étudiants, parlez de vos difficultés"
    />
    <div className="fr-text--lead">Consultez un psychologue gratuitement</div>
    <StudentCards />
    <a
      className={classnames(styles.button, 'fr-btn fr-btn--lg fr-btn--secondary')}
      href={`${__API__}/static/documents/parcours_etudiant_sante_psy_etudiant.pdf`}
      target="_blank"
      rel="noreferrer"
      title="Parcours étudiant"
    >
      En savoir plus
    </a>
  </div>
);

export default StudentProcess;
