import React from 'react';
import { observer } from 'mobx-react';
import sanitizeHtml from 'sanitize-html';

import { Accordion } from '@codegouvfr/react-dsfr/Accordion';
import { fr } from '@codegouvfr/react-dsfr';

import FaqProcess from 'components/Faq/FaqProcess';

import { useStore } from 'stores/';
import faq from 'services/faq/faq';
import items from 'services/faq/items';

import styles from './faqTab.cssmodule.scss';

const FaqTab = ({ type, simplified }) => {
  const {
    commonStore: { config },
  } = useStore();

  const onOpenQuestion = (item) => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'FAQ', type, item.question]);
    }
  };

  return (
    <div data-test-id={`tabpanel-${type}`}>
      <div className={fr.cx('fr-mt-3w')}>
        <div className={styles.sections}>
          <div className={simplified ? 'fr-mb-4w' : ''}>
            {items[type].sections.map((section) => (
              <React.Fragment key={section.name}>
                {!simplified && <h4>{section.title}</h4>}
                <div className={simplified ? '' : 'fr-mb-4w'}>
                  {faq[section.name](config)
                    .filter((item) => !simplified || item.frequent)
                    .map((item) => (
                      <Accordion
                        key={item.question}
                        label={item.question}
                        onExpandedChange={(expanded) => {
                          if (expanded) {
                            onOpenQuestion(item);
                          }
                        }}
                      >
                        <div
                          className={styles.answer}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(item.answer, {
                              allowedTags: ['a', 'br', 'ul', 'li'],
                              allowedAttributes: {
                                a: ['href', 'target', 'rel'],
                              },
                            }),
                          }}
                        />
                      </Accordion>
                    ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <FaqProcess simplified={simplified} links={items[type].links} />
    </div>
  );
};

export default observer(FaqTab);
