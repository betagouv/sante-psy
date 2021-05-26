import React from 'react';

import Ariane from 'components/Ariane/Ariane';

import FaqSection from './FaqSection';

const Faq = () => (
  <div className="fr-container fr-mb-3w">
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
        <FaqSection
          id="etudiant"
          title="Je suis étudiant"
          sections={[{ name: 'students' }]}
          flyers={[
            {
              href: `${__API__}/static/documents/flyer_etudiants_fr.pdf`,
              title: 'Voir le dépliant étudiants',
            },
            {
              href: `${__API__}/static/documents/flyer_etudiants_en.pdf`,
              title: 'See the student flyer',
            },
            {
              href: `${__API__}/static/documents/flyer_etudiants_sp.pdf`,
              title: 'Ver el folleto del estudiante',
            },
            {
              href: `${__API__}/static/documents/flyer_etudiants_zn.pdf`,
              title: '见学生传单',
            },
          ]}
        />
        <FaqSection
          id="psy"
          title="Je suis psychologue"
          sections={[
            { title: 'Éligibilité', name: 'eligibility' },
            { title: 'Prix de la séance et remboursement', name: 'reimbursement', id: 'remboursement' },
            { title: 'Déroulé', name: 'process' },
          ]}
          flyers={[
            {
              href: `${__API__}/static/documents/flyer_psychologues.pdf`,
              title: 'Voir le dépliant psychologues',
            },
          ]}
        />
        <FaqSection
          id="medecin"
          title="Je suis médecin généraliste"
          sections={[{ name: 'doctor' }]}
          flyers={[
            {
              href: `${__API__}/static/documents/flyer_medecins.pdf`,
              title: 'Voir le dépliant médecins',
            },
            {
              href: `${__API__}/static/documents/flyer_ssu.pdf`,
              title: 'Voir le dépliant SSU',
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default Faq;
