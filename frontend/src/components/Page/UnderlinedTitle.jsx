import React from 'react';
import classNames from 'classnames';

import styles from './underlinedTitle.cssmodule.scss';

const UnderlinedTitle = ({ title, big, className, backgroundColor }) => {
  const style = big ? 'bigTitle' : 'title';
  const titleStyle = big ? '' : 'fr-h2';

  return (
    <div className={className}>
      <h1 className={classNames(titleStyle, styles[style], styles[`${style}-${backgroundColor}`])}>
        {title}
      </h1>
    </div>
  );
};

export default UnderlinedTitle;
