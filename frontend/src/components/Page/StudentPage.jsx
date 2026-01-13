import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import FaqSection from 'components/Page/FaqSection';

import { NavLink, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@dataesr/react-dsfr';
import styles from './studentPage.cssmodule.scss';

const getNodeText = node => {
  if (['string', 'number'].includes(typeof node)) {
    return node;
  }
  if (node instanceof Array) {
    return node.map(getNodeText).join('');
  }
  if (typeof node === 'object' && node) {
    return getNodeText(node.props.children);
  }
  return '';
};

const StudentPage = ({
  title,
  children,
  className,
  dataTestId = null,
  breadCrumbs,
  currentBreadCrumb,
}) => {
  useEffect(() => {
    if (title) {
      document.title = `${getNodeText(title)} - Santé Psy Étudiant`;
    }
  }, [title]);

  const breadCrumbsComponent = breadCrumbs ? (
    <Breadcrumb className={styles.breadCrumbs}>
      {breadCrumbs.map(breadCrumb => (
        <BreadcrumbItem
          key={breadCrumb.label}
          asLink={<Link to={breadCrumb.href} />}
        >
          {breadCrumb.label}
        </BreadcrumbItem>
      ))}
      <BreadcrumbItem className={styles.currentBreadCrumb}>
        {currentBreadCrumb || getNodeText(title)}
      </BreadcrumbItem>
    </Breadcrumb>
  ) : null;

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
                to="/etudiant/mes-seances"
                className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
              >
                Mes séances
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
      {breadCrumbsComponent}
      {title && (
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      )}
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
