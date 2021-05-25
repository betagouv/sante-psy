import React from 'react';
import { HashLink } from 'react-router-hash-link';

const Student = () => (
  <div className="fr-container--fluid">
    <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters bg-fond-alternatif">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
          <div className="fr-col fr-col-xs-10 fr-col-md-10 fr-my-2w">
            <h2 id="je-suis-etudiant">Je suis étudiant, étudiante</h2>
            <p className="fr-mb-2w">
              Tous les étudiants du supérieur sont éligibles
              (universités, écoles publiques et privées, BTS, ...), de toutes les nationalités.
            </p>
            <p className="fr-mb-2w">
              Pour commencer le parcours de soins,
              si vous connaissez votre Service de Santé Universitaire, contactez les.
              Sinon, vous pouvez également contacter votre médecin traitant ou un médecin généraliste.
            </p>
            <p className="fr-mb-2w">
              Lorsque votre médecin (universitaire ou généraliste)
              vous aura orienté vers des séances de psychologue,
              vous pourrez choisir parmi les psychologues partenaires
              dans n&lsquo;importe quel département, peu importe votre université d&lsquo;origine :
            </p>
            <p className="fr-mb-2w">
              <HashLink
                className="fr-btn fr-btn--lg fr-btn--alt"
                to="/trouver-un-psychologue"
              >
                Trouver un psychologue
              </HashLink>
            </p>
            <p className="fr-mb-2w">
              Des questions, des doutes sur le dispositif ?
            </p>
            <p className="fr-mb-2w">
              <a className="fr-btn fr-btn--secondary" href="/faq#etudiant">Consulter la Foire Aux Questions</a>
            </p>
            <p className="fr-mb-2w">
              Nous vous suggérons aussi ce site de conseils pour gérer ses difficultés pendant cette période de crise :
            </p>
            <a className="fr-btn fr-btn--secondary" href="https://www.soutien-etudiant.info" target="_blank" rel="noopener noreferrer">
              Voir le site www.soutien-etudiant.info
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Student;
