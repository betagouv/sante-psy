import React, { useEffect, useRef, useState } from 'react';

const FaqItem = ({ item, section, index }) => {
  const collapsableSection = useRef();
  const [expanded, setExpanded] = useState(false);
  const [collapse, setCollapse] = useState(0);

  useEffect(() => {
    const value = expanded
      ? 0
      : collapsableSection.current.getBoundingClientRect().height;
    setCollapse(`-${value}px`);
  }, [expanded]);

  const switchCollapse = () => {
    setExpanded(!expanded);
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
            maxHeight: expanded ? 'unset' : 0,
            '--collapse': collapse,
          }}
        >
          <div className="fr-accordion__inner">
            <p
              className="fr-mb-1v"
              ref={collapsableSection}
            >
              {item.answer}
            </p>
          </div>
        </div>
      </section>
    </li>
  );
};

export default FaqItem;
