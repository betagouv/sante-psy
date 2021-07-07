import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import sanitizeHtml from 'sanitize-html';

import {
  Container,
  Row,
  Col,
  SideMenu,
  SideMenuLink,
  Accordion,
  AccordionItem,
  Title,
} from '@dataesr/react-dsfr';

import FaqProcess from 'components/Faq/FaqProcess';

import { useStore } from 'stores/';
import faq from 'services/faq/faq';

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
  const refs = itemsByType[type].sections.map(() => useRef(null));
  const { commonStore: { config } } = useStore();
  const [activeSection, setActiveSection] = useState();

  return (
    <Container>
      <FaqProcess
        label={itemsByType[type].label}
        links={itemsByType[type].links}
      />
      <Row>
        <SideMenu
          buttonLabel="Dans cette rubrique"
          className="fr-sidemenu--sticky fr-col-md-4 fr-col-sm-12"
        >
          {itemsByType[type].sections.map((section, index) => (
            <SideMenuLink
              key={section.title}
              onClick={() => {
                refs[index].current.scrollIntoView();
                setActiveSection(section);
              }}
              className={
                      activeSection && activeSection.title === section.title ? 'fr-sidemenu__item--active' : ''
                    }
            >
              {section.title}
            </SideMenuLink>
          ))}
        </SideMenu>
        <Col n="md-8 sm-12">
          {itemsByType[type].sections.map((section, index) => (
            <div ref={refs[index]} key={section.name}>
              <Title as="h2">{section.title}</Title>
              <Accordion>
                {faq[section.name](config)
                  .map(item => (
                    <AccordionItem title={item.question} key={item.question}>
                      <div
                      // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(item.answer,
                            {
                              allowedTags: ['a'],
                              allowedAttributes: { a: ['href', 'target', 'rel'] },
                            }),
                        }}
                      />
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default observer(FaqTab);
