import React, { useEffect } from 'react';
import { useStore } from 'stores';
import { Link } from 'react-router-dom';
import StudentHistory from './StudentHistory/StudentHistory';
import styles from './homepage.cssmodule.scss';

const StudentHomepage = () => {
  const { userStore: { user, pullUser } } = useStore();

  useEffect(() => {
    pullUser();
  }, []);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.firstNameGroup}>
          <span className="fr-icon-user-line" aria-hidden="true" />
          <strong>
            Bonjour
            {' '}
            {user.firstNames}
          </strong>
        </div>
        <p>
          INE :
          {' '}
          {user.ine}
        </p>
      </div>

      <div className={styles.container} data-test-id="dashboard_student">
        <div className={styles.titleRow}>
          <h2>
            Mes RDV passés
          </h2>
          <Link
            to="/trouver-un-psychologue"
            target="_blank"
            rel="noopener noreferrer"
            className="fr-btn fr-btn--primary"
          >
            Prendre RDV
          </Link>
        </div>
        <StudentHistory />
        <Link
          to="/etudiant/numeros-urgence"
          className={styles.ctaBtn}
        >
          <span className="fr-icon-phone-line" aria-hidden="true" />
          Je me sens mal
        </Link>
      </div>
    </>
  );
};

export default StudentHomepage;
