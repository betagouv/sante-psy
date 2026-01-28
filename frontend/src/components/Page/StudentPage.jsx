import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

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
}) => {
  useEffect(() => {
    if (title) {
      document.title = `${getNodeText(title)} - Santé Psy Étudiant`;
    }
  }, [title]);

  return (
    <>
      <div className={styles.studentHeader} />
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
    </>
  );
};

export default observer(StudentPage);
