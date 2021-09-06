import React from 'react';
import classNames from 'classnames';

import styles from './underlinedTitle.cssmodule.scss';

const UnderlinedTitle = ({ title, big, className, backgroundColor }) => {
  const style = big ? 'bigTitle' : 'title';

  return (
    <div className={className}>
      <h1 className={classNames(styles[style], styles[`${style}-${backgroundColor}`], { 'fr-h2': !big })}>
        {title}
      </h1>
    </div>
  );
};

export default UnderlinedTitle;
