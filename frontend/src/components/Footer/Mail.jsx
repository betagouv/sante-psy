import { Container } from '@dataesr/react-dsfr';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './mail.cssmodule.scss';

const Mail = ({ marge, className = null }) => (
  <Container spacing="my-4w" className={classnames(className, styles[marge])}>
    <Link to="/contact">
      Des questions ? Une difficulté ? Contactez nous !
    </Link>
  </Container>
);

export default Mail;
