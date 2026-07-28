import React from 'react';
import styles from './tooltip.cssmodule.scss';

export const Tooltip = ({ tooltip, children, ...props }) => (
  <div className={styles.hoverElement} {...props}>
    {tooltip && <span className={styles.tooltip}>{tooltip}</span>}
    {children}
  </div>
);
