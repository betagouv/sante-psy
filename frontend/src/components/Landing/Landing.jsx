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

const Landing = () => {
  const { commonStore: { config } } = useStore();
  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div data-test-id="landingPageContainer" className={styles.landing}>
      <Slice
        customStyle={{container: styles.firstSlice}}
        imageSrc="/images/landing-2.png"
        title={(
          <>
          Étudiants, bénéficiez de <br/> <b>8 séances</b> <span class="colored">avec un psychologue</span> <b>sans avance de frais</b>
          </>
        )}
      />
    
      <StudentEligibilityTunnel />
    
      {/* <MozaicInstagram/> */}
      {/* <StudentProcess /> */}
      <Statistics />
      <Slice
        color="white"
        customStyle={{container: styles.secondSlice, content: styles.content}}
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
        customStyle={{container: styles.thirdSlice}}
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
        customStyle={{container: styles.fourthSlide, content: styles.content}}
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
        customStyle={{container: styles.fifthSlide, content: styles.content}}
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
        customStyle={{container: styles.sixthSlide}}
        color="white"
      >
        <OtherServices/> 
      </Slice> 
      {/* <Slice
        color="white"
        reverse
        imageSrc="/images/teleconsultation.png"
        centerText
        title={(
          <>
            Avez-vous pensé à
            {' '}
            <b>téléconsulter</b>
            &#x00A0;?
          </>
        )}
        description={(
          <>
            Consultez
            {' '}
            <b>à distance</b>
            {' '}
            depuis votre ordinateur ou votre mobile
          </>
        )}
        buttonLink="/trouver-un-psychologue?teleconsultation=true"
        buttonText="Trouver un psychologue"
        hint={(
          <>
            <b>Plus de 900 psychologues</b>
            {' '}
            disponibles en téléconsultation
          </>
        )}
      />
      <Faq simplified />
      <FollowInstagram />
      <Slice
        color="secondary"
        centerText
        title={(
          <>
            Besoin d’
            <b>en savoir plus</b>
            &#x00A0;?
          </>
        )}
        description={(
          <>
            Recevez toute l’information nécessaire par e-mail pour bénéficier des
            {' '}
            <b>8 séances gratuites</b>
            {' '}
            avec un psychologue
          </>
        )}
      >
        <Newsletter />
      </Slice>
      <Slice
        imageSrc="/images/demarches-simplifiees.png"
        reverse
        title={(
          <>
            Vous êtes
            {' '}
            <b>psychologue</b>
            &#x00A0;?
          </>
        )}
        description="Rejoignez le programme d‘accompagnement psychologique des étudiants"
        buttonText="Commencer l’inscription"
        buttonLink={config.demarchesSimplifieesUrl}
        hint={(
          <>
            Inscription en
            {' '}
            <b>3 minutes</b>
          </>
        )}
      /> */}
    </div>
  );
};

export default observer(Landing);
