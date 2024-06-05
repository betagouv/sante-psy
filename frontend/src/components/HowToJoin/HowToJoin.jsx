import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStore } from 'stores/index';
import LandingBottom from 'components/Landing/LandingBottom';
import HowToJoinCards from './HowToJoinCards';
import styles from './howToJoin.cssmodule.scss';
import { useLocation } from 'react-router-dom';
import Steps from './Steps';

const HowToJoin = () => {

  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div>
      <div className={styles.cards}><HowToJoinCards/></div>
      <LandingBottom/>
    </div>
  );
};

export default observer(HowToJoin);
