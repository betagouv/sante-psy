import classNames from 'classnames';
import React from 'react';
import styles from './service.cssmodule.scss';

const Service = ({
  image,
  logo,
  name,
  title,
  description,
  link,
}) => (
  <div className={styles.service}>
    <img src={image} alt={`${name} visuel`} />
    <div className={styles.serviceContent}>
      <img src={logo} alt={`${name} logo`} />
      <p className={styles.name}>{name}</p>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
      <a
        className={classNames(styles.button, 'fr-btn fr-btn--secondary')}
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        Découvrir
        {' '}
        {name}
      </a>
    </div>
  </div>
);

export default Service;
