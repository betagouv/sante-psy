import React from 'react';
import { Link } from 'react-router-dom';
import styles from './mail.cssmodule.scss';

const Mail = ({ noMarge }) => (
  <div className={noMarge ? styles.noMarge : 'fr-my-4w'}>
    <Link to="/contact">
      Des questions ? Une difficulté ? Contactez nous !
    </Link>
  </div>
);

export default Mail;
