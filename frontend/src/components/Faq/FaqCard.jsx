import React from 'react';
import sanitizeHtml from 'sanitize-html';

import styles from './faqCard.cssmodule.scss';

const FaqCard = ({ question, answer }) => (
  <div className="fr-col-12 fr-col-md-6">
    <div className={styles.card}>
      <p className={styles.question}>
        {question}
      </p>
      <p
        className={styles.answer}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(answer,
            {
              allowedTags: ['a'],
              allowedAttributes: { a: ['href', 'target', 'rel'] },
            }),
        }}
      />
    </div>
  </div>
);

export default FaqCard;
