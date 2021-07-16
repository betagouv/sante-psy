import React from 'react';
import classnames from 'classnames';
import { Row } from '@dataesr/react-dsfr';

import UnderlinedTitle from 'components/Page/UnderlinedTitle';
import StudentCard from './StudentCard';

import styles from './studentProcess.cssmodule.scss';

const StudentProcess = () => (
  <div className={styles.container}>
    <UnderlinedTitle big title="Étudiants, parlez de vos difficultés" />
    <div className={styles.description}>Consultez un psychologue gratuitement</div>
    <Row className={styles.card}>
      <StudentCard
        index={1}
        title="Je consulte un médecin"
        image="doctor"
        description="Votre médecin généraliste ou votre Service de Santé Universitaire vous oriente vers un accompagnement psychologique."
      />
      <StudentCard
        index={2}
        title="Je choisis un psychologue"
        image="psychologist"
        description="Vous choisissez le professionnel qui vous accompagnera parmi la liste des psychologues partenaires."
      />
      <StudentCard
        index={3}
        title="Je bénéficie d'un suivi"
        image="followup"
        description="Vous prenez rendez-vous avec votre psychologue, qui vous suivra pendant 3 à 6 séances si besoin. "
      />
    </Row>
    <a
      className={classnames(styles.button, 'fr-btn fr-btn--lg fr-btn--secondary')}
      href={`${__API__}/static/documents/parcours_etudiant_sante_psy_etudiant.pdf`}
      target="_blank"
      rel="noreferrer"
    >
      En savoir plus
    </a>
  </div>
);

export default StudentProcess;
