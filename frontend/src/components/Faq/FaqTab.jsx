import React from 'react';
import { observer } from 'mobx-react';
import sanitizeHtml from 'sanitize-html';

import {
  Row,
  Col,
  Accordion,
  AccordionItem,
} from '@dataesr/react-dsfr';

import FaqProcess from 'components/Faq/FaqProcess';

import { useStore } from 'stores/';
import faq from 'services/faq/faq';
import items from 'services/faq/items';

import styles from './faqTab.cssmodule.scss';

const FaqTab = ({ type, simplified }) => {
  const { commonStore: { config } } = useStore();

  const onOpenQuestion = item => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'FAQ', type, item.question]);
    }
  };

  return (
    <div data-test-id={`tabpanel-${type}`}>
      <Row spacing="mt-3w">
        <Col className={styles.sections}>
          <Accordion>
            {items[type].sections.flatMap(section => (
              faq[section.name](config)
                .filter(item => !simplified || item.frequent)
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
                ))
            ))}
          </Accordion>
        </Col>
      </Row>
      <FaqProcess
        simplified={simplified}
        links={items[type].links}
      />
    </div>
  );
};

export default observer(FaqTab);
