import React from 'react';
import { HashLink } from 'react-router-hash-link';
import Section from '../Section/Section';

import styles from './landing.cssmodule.scss';
import Psychologist from './Psychologist';
import Student from './Student';

const Landing = () => (
  <>
    <div className="fr-container" data-test-id="landingPageContainer">
      <div className="fr-grid-row fr-grid-row--center fr-grid-row--middle fr-mt-1v fr-pb-1v">
        <div id="hero-col-1" className="fr-col-md-5 fr-col-xs-6 fr-pr-6w">
          <h1>Étudiants, parlez de vos difficultés</h1>
          <p className="fr-text--lg fr-mb-1v">
            Consultez un psychologue gratuitement
          </p>
        </div>
        <div id="hero-col-2" className="fr-col-md-7 fr-col-xs-6">
          <div>
            <img
              className={styles.image}
              src="/images/illustration_sante_psy.svg"
              alt="Séance chez un psychologue"
            />
          </div>
        </div>
      </div>
    </div>
    <Section
      title="Comment ça se passe ?"
      subtitle="Trois étapes indispensables"
      sections={[
        {
          title: '1. Consultez un médecin',
          text: 'Votre médecin généraliste ou votre Service de Santé Universitaire vous oriente vers un accompagnement psychologique.',
        },
        {
          title: '2. Choisissez un psychologue',
          text: 'Vous choisissez le professionnel qui vous accompagnera parmi la liste des psychologues partenaires.',
        },
        {
          title: '3. Bénéficiez d\'un suivi',
          text: 'Vous prenez rendez-vous avec votre psychologue, qui vous suivra pendant 3 séances. Votre médecin pourra les renouveler si besoin.',
        },
      ]}
    />
    <div className="fr-centered fr-p-2w fr-bg--alt">
      <p className="fr-mb-2w">Étudiants, psychologues, médecins, vous souhaitez plus d’informations ?</p>
      <HashLink className="fr-btn fr-btn--secondary" to="/faq">
        Consulter la Foire Aux Questions
      </HashLink>
    </div>
    <Student />
    <Psychologist />
  </>
);

export default Landing;
