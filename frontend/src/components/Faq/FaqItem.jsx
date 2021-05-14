import React, { useState } from 'react';

const FaqItem = ({ item, section, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [collapse, setCollapse] = useState();

  const switchCollapse = () => {
    setExpanded(!expanded);
    const id = `accordion-${section}${index}`;
    const value = document.getElementById(id).getBoundingClientRect().height;
    setCollapse(`-${value}px`);
  };
  return (
    <li>
      <section className="fr-accordion">
        <h3 className="fr-accordion__title">
          <button
            type="button"
            className="fr-accordion__btn"
            aria-expanded={expanded}
            aria-controls={`accordion-${section}${index}`}
            onClick={switchCollapse}
          >
            {item.question}
          </button>
        </h3>
        <div
          className={expanded ? 'fr-collapse fr-collapse--expanded' : 'fr-collapse'}
          style={{
            maxHeight: expanded ? null : 'none',
            '--collapse': collapse,
          }}
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
