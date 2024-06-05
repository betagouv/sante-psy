import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import Faq from 'components/Faq/Faq';
import { useStore } from 'stores/index';
import StudentProcess from './StudentProcess';
import Statistics from './Statistics';

import Newsletter from './Newsletter';
import FollowInstagram from './FollowInstagram';
import styles from './landing.cssmodule.scss';
import StudentEligibilityTunnel from 'components/Eligibility/StudentEligibilityTunnel';
import MozaicInstagram from './MosaicInstagram';
import PsychologistCards from './PsychologistCards';
import OtherServices from 'components/OtherServices/OtherServices';
import LandingBottom from './LandingBottom';

const Landing = () => {
  const { commonStore: { config } } = useStore();
  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div data-test-id="landingPageContainer" className={styles.landing}>
      <Slice
        customStyle={{container: styles.topSlice}}
        imageSrc="/images/landing-2.png"
        title={(
          <>
          Étudiants, bénéficiez de <br/> <b>8 séances</b> <span class="colored">avec un psychologue</span> <b>sans avance de frais</b>
          </>
        )}
      />
      <StudentEligibilityTunnel />
      <Statistics />
      <LandingBottom />
    </div>
  );
};

export default observer(Landing);
