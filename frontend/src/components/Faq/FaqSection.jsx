import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, AccordionItem } from '@dataesr/react-dsfr';
import sanitizeHtml from 'sanitize-html';

import faq from 'services/faq/faq';
import { useStore } from 'stores/';

const FaqSection = ({ id, sections, title, flyers }) => {
  const { commonStore: { config } } = useStore();
  return (
    <>
      <h1 id={id}>{title}</h1>

      <div className="fr-mb-3w">
        <div>
          <span className="fr-fi-arrow-right-line fr-fi--md" />
          <span>Vous voulez plus d&lsquo;infos sur le dispositif ?</span>
        </div>
        <div>
          {flyers.map(flyer => (
            <a
              key={flyer.href}
              className="fr-btn fr-btn--alt fr-mt-2w fr-mr-2w"
              href={flyer.href}
              target="_blank"
              rel="noreferrer"
            >
              {flyer.title}
            </a>
          ))}
        </div>
        <div className="fr-text--xs fr-mt-2w">
          Note : si vous utilisez Safari et que le flyer ne s&lsquo;affiche pas (&quot;Module bloqué&quot;),
          essayez Firefox ou Chrome.
        </div>
      </div>

      {sections.map(section => (
        <>
          {section.title && <h2 id={section.id}>{section.title}</h2>}
          <Accordion key={section.name}>
            {faq[section.name](config).map(item => (
              <AccordionItem key={item.question} title={item.question}>
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
        </>
      ))}
    </>
  );
};

export default observer(FaqSection);
