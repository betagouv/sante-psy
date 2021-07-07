import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';
import faq from 'services/faq/faq';

import {
  Container,
  Row,
  Col,
  SideMenu,
  SideMenuLink,
} from '@dataesr/react-dsfr';

import FaqCard from 'components/Faq/FaqCard';
import FaqProcess from 'components/Faq/FaqProcess';

const itemsByType = {
  student: {
    index: 1,
    label: 'étudiants',
    links: [
      {
        href: '/static/documents/parcours_etudiant_sante_psy_etudiant.pdf',
        title: 'Parcours étudiant',
      },
      {
        href: '/static/documents/flyer_etudiants_fr.pdf',
        title: 'Voir le dépliant étudiants',
      },
      {
        href: '/static/documents/flyer_etudiants_en.pdf',
        title: 'See the student flyer',
      },
      {
        href: '/static/documents/flyer_etudiants_sp.pdf',
        title: 'Ver el folleto del estudiante',
      },
      {
        href: '/static/documents/flyer_etudiants_zn.pdf',
        title: '见学生传单',
      },
    ],
    sections: [
      { title: 'Éligibilité', name: 'eligibility' },
      { title: 'Paiement', name: 'payment' },
      { title: 'Séance', name: 'session' },
    ],
  },
  psychologist: {
    index: 2,
    label: 'psychologues',
    links: [
      {
        href: '/static/documents/parcours_psychologue_sante_psy_etudiant.pdf',
        title: 'Parcours psychologue',
      },
      {
        href: '/static/documents/flyer_psychologues.pdf',
        title: 'Voir le dépliant psychologues',
      },
    ],
    sections: [
      { title: 'Éligibilité', name: 'psyEligibility' },
      { title: 'Inscription', name: 'registration' },
      { title: 'Connexion', name: 'connection' },
      { title: 'Prix de la séance et remboursement', name: 'reimbursement' },
      { title: 'Déroulé', name: 'process' },
      { title: 'Conventionnement', name: 'agreement' },
      { title: 'Séance', name: 'psySession' },
      { title: 'Facturation', name: 'billing' },
      { title: 'Rétractation', name: 'retractation' },
    ],
  },
  doctor: {
    index: 3,
    label: 'médecins',
    links: [
      {
        href: '/static/documents/flyer_medecins.pdf',
        title: 'Voir le dépliant médecins',
      },
      {
        href: '/static/documents/flyer_ssu.pdf',
        title: 'Voir le dépliant SSU',
      },
    ],
    sections: [
      { title: 'Divers', name: 'doctor' },
    ],
  },
};

const FaqTab = ({ type }) => {
  const { commonStore: { config } } = useStore();
  const [activeSection, setActiveSection] = useState();

  return (
    <Container>
      <FaqProcess
        label={itemsByType[type].label}
        links={itemsByType[type].links}
      />
      <Row>
        <Col n="md-3 sm-12">
          <SideMenu buttonLabel="Dans cette rubrique">
            {itemsByType[type].sections.map(section => (
              <SideMenuLink
                key={section.title}
                onClick={() => { setActiveSection(section); }}
                className={
                      activeSection && activeSection.title === section.title ? 'fr-sidemenu__item--active' : ''
                    }
              >
                {section.title}
              </SideMenuLink>
            ))}
          </SideMenu>
        </Col>
        <Col>
          <Row gutters spacing="pt-3w">
            { activeSection ? faq[activeSection.name](config).map(item => (
              <FaqCard
                question={item.question}
                answer={item.answer}
              />
            )) : itemsByType[type].sections.map(section => faq[section.name](config).map(item => (
              <FaqCard
                question={item.question}
                answer={item.answer}
              />
            )))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default observer(FaqTab);
