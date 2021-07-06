import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';
import faq from 'services/faq/faq';

import {
  Tabs, Tab, Row,
  Col,
  SideMenu,
  SideMenuLink,
} from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import FaqCard from 'components/Faq/FaqCard';
import FaqProcess from 'components/Faq/FaqProcess';

const itemsByType = {
  student: {
    index: 1,
    label: 'étudiants',
    link: '/static/documents/flyer_etudiants_fr.pdf',
    sections: [
      { title: 'Éligibilité', name: 'eligibility' },
      { title: 'Paiement', name: 'payment' },
      { title: 'Séance', name: 'session' },
    ],
  },
  psychologist: {
    index: 2,
    label: 'psychologues',
    link: '/static/documents/flyer_psychologues.pdf',
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
    link: '/static/documents/flyer_medecins.pdf',
    sections: [
      { title: 'Divers', name: 'doctor' },
    ],
  },
};

const Faq = () => {
  const { commonStore: { config } } = useStore();
  const [activeSection, setActiveSection] = useState();
  return (
    <Page
      title="Foire aux questions"
      description="J'accède à la foire aux questions, que je sois étudiant, psychologue ou médecin
    afin de trouver une réponse à ma question"
      background="blue"
    >
      <Tabs>
        <Tab label="Je suis étudiant">
          <FaqProcess
            label={itemsByType.student.label}
            link={itemsByType.student.link}
          />
          <Row>
            <Col n="md-3 sm-12">
              <SideMenu>
                {itemsByType.student.sections.map(section => (
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
                )) : itemsByType.student.sections.map(section => faq[section.name](config).map(item => (
                  <FaqCard
                    question={item.question}
                    answer={item.answer}
                  />
                )))}
              </Row>
            </Col>
          </Row>
        </Tab>
        <Tab label="Je suis psychologue">
          {/* <FaqProcess
            label={itemsByType.psychologist.label}
            link={itemsByType.psychologist.link}
          />
          <Row>
            <Col n="md-3 sm-12">
              <SideMenu>
                {itemsByType.psychologist.sections.map(section => (
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
                )) : itemsByType.psychologist.sections.map(section => faq[section.name](config).map(item => (
                  <FaqCard
                    question={item.question}
                    answer={item.answer}
                  />
                )))}
              </Row>
            </Col>
          </Row> */}
        </Tab>
        <Tab label="Je suis médecin">
          {/* <FaqProcess
            label={itemsByType.doctor.label}
            link={itemsByType.doctor.link}
          />
          <Row>
            <Col n="md-3 sm-12">
              <SideMenu>
                {itemsByType.doctor.sections.map(section => (
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
                )) : itemsByType.doctor.sections.map(section => faq[section.name](config).map(item => (
                  <FaqCard
                    question={item.question}
                    answer={item.answer}
                  />
                )))}
              </Row>
            </Col>
          </Row> */}
        </Tab>
      </Tabs>
    </Page>
  );
};

export default observer(Faq);
