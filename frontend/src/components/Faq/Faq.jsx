import React from 'react';

import Ariane from 'components/Ariane/Ariane';
import FaqItems from './FaqItems';

const Faq = () => (
  <>
    <Ariane
      previous={[
        {
          label: 'Accueil',
          url: '/',
        },
      ]}
      current="Foire aux questions"
    />

    <div className="fr-grid-row fr-grid-row--gutters fr-b__two-col">
      <nav className="fr-container fr-col-xs-12 fr-col-md-3 fr-sidemenu--sticky" aria-label="Menu latéral">
        <div className="fr-sidemenu fr-displayed-md">
          <div className="fr-sidemenu__inner">
            <ul className="fr-sidemenu__list">
              <li className="fr-sidemenu__item">
                <a className="fr-sidemenu__link" href="#etudiant" target="_self">Étudiants</a>
              </li>
              <li className="fr-sidemenu__item">
                <a className="fr-sidemenu__link" href="#psy" target="_self">Psychologues</a>
              </li>
              <li className="fr-sidemenu__item">
                <a className="fr-sidemenu__link" href="#medecin" target="_self">Médecins</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-sidemenu__list fr-hidden-md">
          <div className="fr-grid-row">
            <a className="fr-col-4 fr-sidemenu__link fr-m-0" href="#etudiant" target="_self">Étudiants</a>
            <a className="fr-col-5 fr-sidemenu__link fr-m-0" href="#psy" target="_self">Psychologues</a>
            <a className="fr-col-3 fr-sidemenu__link fr-m-0" href="#medecin" target="_self">Médecins</a>
          </div>
        </div>
      </nav>

      <div className="fr-container fr-col-xs-12 fr-col-md-9">
        <h1 id="etudiant">Je suis étudiant</h1>

        <div className="fr-mb-3w">
          <div>
            <span className="fr-fi-arrow-right-line fr-fi--md" />
            <span>Vous voulez plus d&lsquo;infos sur le dispositif ?</span>
          </div>
          <div>
            <a className="fr-btn fr-btn--alt fr-mt-2w" href="/static/images/flyer_etudiants.pdf">
              Voir le flyer étudiants
            </a>
          </div>
          <div className="fr-text--xs fr-mt-2w">
            Note : si vous utilisez Safari et que le flyer ne s&lsquo;affiche pas (&quot;Module bloqué&quot;),
            essayez Firefox ou Chrome.
          </div>
        </div>

        <ul className="fr-accordion-group">
          <FaqItems section="students" />
        </ul>

        <h1 id="psy">Je suis psychologue</h1>

        <div className="fr-mb-3w">
          <div>
            <span className="fr-fi-arrow-right-line fr-fi--md" />
            <span>Vous voulez plus d&lsquo;infos sur le dispositif ?</span>
          </div>
          <div>
            <a className="fr-btn fr-btn--alt fr-mt-2w" href="/static/images/flyer_psychologues.pdf">
              Voir le flyer psychologues
            </a>
          </div>
          <div className="fr-text--xs fr-mt-2w">
            Note : si vous utilisez Safari et que le flyer ne s&lsquo;affiche pas (&quot;Module bloqué&quot;),
            essayez Firefox ou Chrome.
          </div>
        </div>

        <ul className="fr-accordion-group">
          <h2>Éligibilité</h2>
          <FaqItems section="eligibility" />

          <h2 id="remboursement">Prix de la séance et remboursement</h2>
          <FaqItems section="reimbursement" />

          <h2>Déroulé</h2>
          <FaqItems section="process" />
        </ul>

        <h1 id="medecin">Je suis médecin généraliste</h1>

        <div className="fr-mb-3w">
          <div>
            <span className="fr-fi-arrow-right-line fr-fi--md" />
            <span>Vous voulez plus d&lsquo;infos sur le dispositif ?</span>
          </div>
          <div>
            <a className="fr-btn fr-btn--alt fr-mt-2w" href="/static/images/flyer_medecins.pdf">
              Voir le flyer médecins
            </a>
          </div>
          <div>
            <a className="fr-btn fr-btn--alt fr-mt-2w" href="/static/images/flyer_ssu.pdf">
              Voir le flyer SSU
            </a>
          </div>
          <div className="fr-text--xs fr-mt-2w">
            Note : si vous utilisez Safari et que le flyer ne s&lsquo;affiche pas (&quot;Module bloqué&quot;),
            essayez Firefox ou Chrome.
          </div>
        </div>

        <ul className="fr-accordion-group">
          <FaqItems section="doctor" />
        </ul>

      </div>
    </div>
  </>
);

export default Faq;
