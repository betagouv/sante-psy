import React, { useState } from 'react';

const FaqItem = ({ item, section, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <li>
      <section className="fr-accordion">
        <h3 className="fr-accordion__title">
          <button
            type="button"
            className="fr-accordion__btn"
            aria-expanded={expanded}
            aria-controls={`accordion-${section}${index}`}
            onClick={() => { setExpanded(!expanded); }}
          >
            {item.question}
          </button>
        </h3>
        <div
          className="fr-collapse"
          id={`accordion-${section}${index}`}
        >
          <div className="fr-accordion__inner">
            <p className="fr-mb-1v">
              {item.answer}
            </p>
          </div>
        </div>
      </section>
    </li>
  );
};

export default FaqItem;
