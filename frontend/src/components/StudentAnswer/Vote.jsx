import React from 'react';

import classnames from 'classnames';
import styles from './vote.cssmodule.scss';

const Vote = ({ background, image, label, onClick }) => (
  <div className={classnames(styles.container, styles[background])} onClick={onClick}>
    <img src={`/images/${image}.svg`} alt="" />
    <span>{label}</span>
  </div>
);

export default Vote;
