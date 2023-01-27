import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import {
  Icon,
  Breadcrumb,
  BreadcrumbItem,
} from '@dataesr/react-dsfr';

import Tutorial from 'components/Tutorial/Tutorial';
import Announcement from 'components/Notification/Announcement';
import { useStore } from 'stores/';

import Statistics from 'components/Landing/Statistics';
import FaqSection from './FaqSection';

import styles from './page.cssmodule.scss';

// Inspired from https://stackoverflow.com/a/60564620
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

const Page = ({
  title,
  description,
  children,
  textContent,
  withContact,
  withStats,
  tutorial,
  breadCrumbs,
  currentBreadCrumb,
  dataTestId = null,
  withNotification = false,
}) => {
  const { userStore: { user } } = useStore();
  const [tutoStatus, setTutoStatus] = useState({ run: false, stepIndex: 0 });

  useEffect(() => {
    document.title = `${getNodeText(title)} - Santé Psy Étudiant`;
  }, []);

  return (
    <>
      {withNotification && <Announcement />}
      <Tutorial
        tutoStatus={tutoStatus}
        setTutoStatus={setTutoStatus}
        id={user && !user.hasSeenTutorial ? 'global' : tutorial}
      >
        <div className={styles.background} data-test-id={dataTestId}>
          <div className={styles.header}>
            {tutorial && (
            <div
              id="launch-tutorial"
              data-test-id="launch-tutorial"
              className={styles.tutorial}
              onClick={() => setTutoStatus({ run: true, stepIndex: 0 })}
            >
              <Icon
                name="fr-fi-information-fill"
              />
            </div>
            )}
            {breadCrumbs && (
              <Breadcrumb>
                {breadCrumbs.map(breadCrumb => (
                  <BreadcrumbItem
                    className={styles.previousBreadCrumb}
                    key={breadCrumb.label}
                    href={breadCrumb.href}
                  >
                    {breadCrumb.label}
                  </BreadcrumbItem>
                ))}
                <BreadcrumbItem
                  className={styles.currentBreadCrumb}
                >
                  {currentBreadCrumb || getNodeText(title)}
                </BreadcrumbItem>
              </Breadcrumb>
            )}
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <div className={styles.container}>
            {textContent
              ? <div className={styles.textContainer}>{children}</div>
              : children}
          </div>
        </div>
        {withContact && <FaqSection />}
        {withStats && <Statistics />}
      </Tutorial>
    </>
  );
};

export default observer(Page);
