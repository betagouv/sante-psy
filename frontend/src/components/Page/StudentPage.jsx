import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import FaqSection from 'components/Page/FaqSection';

import styles from './studentPage.cssmodule.scss';
import { NavLink } from 'react-router-dom';

const StudentPage = ({
  title,
  children,
  className,
  dataTestId = null,
}) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} - Santé Psy Étudiant`;
    }
  }, [title]);

  return (
    <>
      <div className={styles.studentHeader}>
        <nav
      className={styles.menu}
      aria-label="Menu principal étudiant"
    >
      <ul className={styles.menuList}>
        <li>
          <NavLink
            to="/etudiant/accueil"
            className={({ isActive }) =>
              isActive ? styles.activeLink : undefined
            }
          >
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink to="/trouver-un-psychologue">
            Trouver un psychologue
          </NavLink>
        </li>
        <li>
          <NavLink to="/faq">
            Aide
          </NavLink>
        </li>
      </ul>
    </nav>
      </div>
      <div
        className={classNames(styles.background, className)}
        data-test-id={dataTestId}
      >
        <div className={styles.container}>
          {children}
        </div>
      </div>
      <FaqSection />
    </>
  );
};

export default observer(StudentPage);
