import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './psychologistFinder.cssmodule.scss';

const PsychologistFinder = () => (
  <div className={styles.container}>
    <img
      className={styles.image}
      src="/images/illustration_sante_psy.png"
      alt="Trouver un psychologue"
    />
    <div className={styles.content}>
      <div className={styles.title}>Trouver un psychologue</div>
      <div className={styles.description}>
        Je contacte un psychologue partenaire dans n&lsquo;importe quel département,
        peu importe mon école ou mon université d&lsquo;origine par téléphone,
        email ou par son site web
      </div>
      <Link
        className={classNames('fr-btn fr-btn--lg', styles.button)}
        to="/trouver-un-psychologue"
      >
        Accéder à l&lsquo;annuaire des psychologues
      </Link>
    </div>
  </div>
);

export default PsychologistFinder;
