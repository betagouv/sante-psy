import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import Faq from 'components/Faq/Faq';
import { useStore } from 'stores/index';
import StudentProcess from './StudentProcess';
import Statistics from './Statistics';

import Newsletter from './Newsletter';
import FollowInstagram from './FollowInstagram';
import styles from './landingBottom.cssmodule.scss';
import StudentEligibilityTunnel from 'components/Eligibility/StudentEligibilityTunnel';
import MozaicInstagram from './MosaicInstagram';
import PsychologistCards from './PsychologistCards';
import OtherServices from 'components/OtherServices/OtherServices';

const Landing = () => {
  const { commonStore: { config } } = useStore();
  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div>
      <Slice
        color="white"
        customStyle={{container: styles.mozaicInstagram, content: styles.content}}
        buttonSecondary={true}
        buttonIcon="ri-instagram-line"
        centerText
        Component={MozaicInstagram}
        title={(
          <b>
            Rejoignez la communauté Instagram
            {' '}
            <span>Santé Psy Étudiant</span>
            &#x00A0;
          </b>
        )}
        description={(
          <>
            <b>{config?.statistics?.nbInstaFollower || '21,5k'}</b> abonnés <br/>
            Conseils<br/>
            Témoignages<br/>
            Podcasts<br/>
          </>
        )}
        buttonLink="https://www.instagram.com/sante_psyetudiant/?hl=fr"
        buttonText="Santé Psy Étudiant"
      />

      <Slice
        color="white"
        customStyle={{container: styles.podcast}}
        reverse
        buttonSecondary={true}
        buttonIcon="ri-instagram-line"
        centerText
        imageSrc="/images/kaavan.png"
        title={(
          <>
            <b>Podcast</b> sur la santé mentale
          </>
        )}
        buttonLink="https://www.instagram.com/kaavan_podcast/"
        buttonText="Kaavan podcast"
      />

      <Slice
        customStyle={{container: styles.howTo, content: styles.content}}
        title={(
          <>
            Professionnels de santé,<br/>
            <span>Psychologues</span>,<br/>
            <b> Comment orienter les étudiants ?</b>
          </>
        )}
      />
      
      <Slice color="white">
        <PsychologistCards/> 
      </Slice> 
      <Slice
        customStyle={{container: styles.otherServicesTitle, content: styles.content}}
        title={(
            <b>
              Autres services
              {' '}
              <span>à votre écoute</span>
            </b>
        )}
        description="Vous n’êtes pas éligible au dispositif Santé Psy Etudiant ? Voici d’autres services à votre écoute."
      />
      <Slice 
        customStyle={{container: styles.otherServices}}
        color="white"
      >
        <OtherServices/> 
      </Slice> 
    </div>
  );
};

export default observer(Landing);
