import React from 'react';
import sanitizeHtml from 'sanitize-html';

import { Accordion, AccordionItem } from '@dataesr/react-dsfr';

import styles from './faqCard.cssmodule.scss';

const FaqCard = ({ question, answer }) => (
  <Accordion key={question} className="fr-col-12 fr-col-md-6">
    <AccordionItem key={question} title={question} className={styles.card}>
      <div
      // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(answer,
            {
              allowedTags: ['a'],
              allowedAttributes: { a: ['href', 'target', 'rel'] },
            }),
        }}
      />
    </AccordionItem>
  </Accordion>

);

export default FaqCard;
