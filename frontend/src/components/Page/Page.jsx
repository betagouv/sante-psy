import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb';
import { fr } from '@codegouvfr/react-dsfr';

import Tutorial from 'components/Tutorial/Tutorial';
import { useStore } from 'stores/';

import Statistics from 'components/Landing/Statistics';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import FaqSection from './FaqSection';

import styles from './page.cssmodule.scss';

const getNodeText = (node) => {
  if (['string', 'number'].includes(typeof node)) return node;
  if (node instanceof Array) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node) return getNodeText(node.props.children);
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
  withoutHeader,
  className,
  dataTestId = null,
  psyPage = false,
}) => {
  const {
    userStore: { user },
  } = useStore();
  const [tutoStatus, setTutoStatus] = useState({ run: false, stepIndex: 0 });

  useEffect(() => {
    document.title = `${getNodeText(title)} - Santé Psy Étudiant`;
  }, [title]);

  const breadCrumbsComponent = breadCrumbs ? (
    <Breadcrumb
      className={
        withoutHeader ? styles.breadCrumbsWithoutHeader : styles.breadCrumbs
      }
      currentPageLabel={currentBreadCrumb || getNodeText(title)}
      segments={breadCrumbs.map((breadCrumb) => ({
        label: breadCrumb.label,
        linkProps: { to: breadCrumb.href, as: Link },
      }))}
    />
  ) : null;

  return (
    <Tutorial
      tutoStatus={tutoStatus}
      setTutoStatus={setTutoStatus}
      id={user && !user.hasSeenTutorial ? 'global' : tutorial}
    >
      <div className={psyPage ? styles.psyHeader : ''}>
        <div
          className={classNames(className, styles.background)}
          data-test-id={dataTestId}
        >
          {(!withoutHeader || tutorial) && (
            <div className={styles.header}>
              {breadCrumbsComponent}
              {!withoutHeader && (
                <div>
                  <h1 className={styles.title}>{title}</h1>
                  {description && (
                    <p className={styles.description}>{description}</p>
                  )}
                </div>
              )}
              {tutorial && (
                <div
                  id="launch-tutorial"
                  data-test-id="launch-tutorial"
                  className={
                    !withoutHeader ? styles.tutorial : styles.headerIconOnly
                  }
                  onClick={() => setTutoStatus({ run: true, stepIndex: 0 })}
                >
                  <span className={fr.cx('fr-icon-information-fill')} />
                </div>
              )}
            </div>
          )}
          <div
            className={textContent ? styles.textContainer : styles.container}
          >
            {withoutHeader && breadCrumbsComponent}
            {children}
          </div>
        </div>
      </div>
      {withContact && <FaqSection />}
      {withStats && <Statistics />}
    </Tutorial>
  );
};

export default observer(Page);
