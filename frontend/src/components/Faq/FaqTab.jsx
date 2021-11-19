import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import sanitizeHtml from 'sanitize-html';

import {
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
import items from 'services/faq/items';

import styles from './faqTab.cssmodule.scss';

const FaqTab = ({ type }) => {
  const refs = items[type].sections.map(() => useRef(null));
  const { commonStore: { config } } = useStore();
  const [activeSection, setActiveSection] = useState();

  const onOpenQuestion = item => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'FAQ', type, item.question]);
    }
  };

  return (
    <div data-test-id={`tabpanel-${type}`}>
      <FaqProcess
        label={items[type].label}
        links={items[type].links}
      />
      <Row spacing="mt-3w">
        <SideMenu
          buttonLabel="Dans cette rubrique"
          className="fr-sidemenu--sticky fr-col-md-4 fr-col-sm-12 fr-mb-3w"
        >
          {items[type].sections.map((section, index) => (
            <SideMenuLink
              key={section.title}
              onClick={() => {
                refs[index].current.scrollIntoView();
                setActiveSection(section);
              }}
              className={
                      activeSection && activeSection.title === section.title
                        ? 'fr-sidemenu__item--active'
                        : ''
                    }
            >
              {section.title}
            </SideMenuLink>
          ))}
        </SideMenu>
        <Col n="md-8 sm-12" className={styles.sections}>
          {items[type].sections.map((section, index) => (
            <div ref={refs[index]} key={section.name} id={section.name}>
              <Title as="h2" look="h4">{section.title}</Title>
              <Accordion>
                {faq[section.name](config)
                  .map(item => (
                    <AccordionItem
                      onClick={close => {
                        if (!close) {
                          onOpenQuestion(item);
                        }
                      }}
                      title={item.question}
                      key={item.question}
                    >
                      <div
                        className={styles.answer}
                      // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(
                            item.answer,
                            {
                              allowedTags: ['a', 'br', 'ul', 'li'],
                              allowedAttributes: { a: ['href', 'target', 'rel'] },
                            },
                          ),
                        }}
                      />
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default observer(FaqTab);
