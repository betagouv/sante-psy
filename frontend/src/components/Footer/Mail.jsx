import React from 'react';
import { Link } from 'react-router-dom';
import styles from './mail.cssmodule.scss';

const Mail = ({ withMarge }) => (
  <div className={withMarge ? 'fr-my-4w' : styles.noMarge}>
    <Link to="/contact">
      Des questions ? Une difficulté ? Contactez nous !
    </Link>
  </div>
);

export default Mail;
