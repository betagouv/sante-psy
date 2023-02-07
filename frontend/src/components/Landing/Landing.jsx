import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import Faq from 'components/Faq/Faq';
import { useStore } from 'stores/index';
import StudentProcess from './StudentProcess';
import Statistics from './Statistics';

import Newsletter from './Newsletter';

const Landing = () => {
  const { commonStore: { config } } = useStore();
  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div data-test-id="landingPageContainer">
      <Slice
        imageSrc="/images/landing.png"
        title={(
          <>
            <div><b>Étudiants, étudiantes</b></div>
            Besoin d’une oreille attentive&#x00A0;?
          </>
        )}
        description={(
          <>
            Bénéficiez de
            {' '}
            <b>8 séances gratuites</b>
            {' '}
            avec un psychologue partenaire
          </>
        )}
        buttonLink="/trouver-un-psychologue"
        buttonText="Choisissez un psychologue"
        hint={(
          <>
            Plus de
            {' '}
            <b>35 000 étudiants</b>
            {' '}
            déjà accompagnés
          </>
        )}
      />
      <StudentProcess />
      <Statistics />
      <Slice
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
        buttonLink="/trouver-un-psychologue"
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
      <Slice
        color="white"
        imageSrc="/images/communaute.png"
        centerText
        title={(
          <>
            Rejoignez la communauté
            {' '}
            <b>Santé Psy Etudiant</b>
          </>
        )}
        description={(
          <>
            Déjà plus de
            {' '}
            <b>8 000 abonnés sur Instagram.</b>
            {' '}
            Au programme&#x00A0;: conseils, témoignages et accompagnement
            autour de la santé psychologique des étudiants.
          </>
        )}
        buttonLink="https://www.instagram.com/sante_psyetudiant/?hl=fr"
        buttonIcon="ri-instagram-line"
        buttonText="Santé Psy Etudiant sur Instagram"
        buttonSecondary
      />
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
      />
    </div>
  );
};

export default observer(Landing);
