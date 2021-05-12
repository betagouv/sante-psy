import React from 'react';
import { observer } from 'mobx-react';

import useStore from 'stores/';

const Psychologist = () => {
  const { commonStore: { config } } = useStore();

  return (
    <div className="fr-container">
      <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div className="fr-col fr-col-xs-10 fr-col-md-10">
          <h2 id="je-suis-psychologue">Je suis psychologue</h2>
          <div className="fr-pb-2w">
            <p className="fr-mb-2w">
              Vous souhaitez participer au programme d&lsquo;accompagnement psychologique des étudiants ? Merci !
            </p>
            <p className="fr-mb-2w">
              Une fois inscrit, et en cas d&lsquo;éligibilité, vos coordonnées apparaîtront dans
              l&lsquo;annuaire public des psychologues partenaires sur cette plateforme.
              Une université vous contactera ensuite pour établir une convention.
              Cette convention garantira le remboursement de l&lsquo;ensemble des consultations
              que vous réaliserez dans le cadre de ce dispositif.
            </p>
            <p className="fr-mb-2w">
              <a className="fr-btn fr-btn--secondary" href="/faq#psy">
                Consulter la Foire Aux Questions
              </a>
            </p>
            <p className="fr-my-1v">
              Vous voulez devenir psychologue partenaire du dispositif ?
            </p>
            <a
              className="fr-btn fr-btn--alt"
              href={config.demarchesSimplifieesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Commencer mon inscription
            </a>
            <p className="fr-my-1v">Vous avez déjà reçu la validation suite à la démarche ?</p>
            <a className="fr-btn fr-btn--alt" href="/psychologue/login">Déclarer mes séances</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Psychologist);
