import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import Faq from 'components/Faq/Faq';
import { useStore } from 'stores/index';
import agent from 'services/agent';
import { displayStatistic } from 'services/string';
import StudentProcess from './StudentProcess';
import Statistics from './Statistics';

import Newsletter from './Newsletter';
import FollowInstagram from './FollowInstagram';

const Landing = () => {
  const { commonStore: { config } } = useStore();

  const [patientsCount, setPatientsCount] = useState('100000');
  const [teleconsultPsyCount, setTeleconsultPsyCount] = useState('1200');

  useEffect(() => {
    agent.Statistics.getAll().then(data => {
      if (data.patientsCount) {
        setPatientsCount(data.patientsCount.value.toString());
      }
      if (data.teleconsultPsyCount) {
        setTeleconsultPsyCount(data.teleconsultPsyCount.value.toString());
      }
    });
  }, []);

  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div data-test-id="landingPageContainer">
      <Slice
        imageSrc="/images/landing.png"
        title={(
          <>
            <b>Étudiants, étudiantes</b>
            <br />
            Besoin d’une oreille attentive&#x00A0;?
          </>
        )}
        description={(
          <>
            Bénéficiez de
            {' '}
            <b>12 séances gratuites</b>
            {' '}
            avec un psychologue partenaire
          </>
        )}
        buttonLink="/eligibilite"
        buttonText="Vérifier mon éligibilité"
        hint={(
          <>
            Plus de
            {' '}
            <b>
              {displayStatistic(patientsCount)}
              {' '}
              étudiants
            </b>
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
        buttonLink="/trouver-un-psychologue?teleconsultation=true"
        buttonText="Trouver un psychologue"
        hint={(
          <>
            <b>
              Plus de
              {' '}
              {displayStatistic(teleconsultPsyCount)}
              {' '}
              psychologues
            </b>
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
            <b>12 séances gratuites</b>
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
