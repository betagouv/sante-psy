import React, { useEffect, useRef, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

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
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(item.answer,
                  {
                    allowedTags: ['a'],
                    allowedAttributes: { a: ['href', 'target', 'rel'] },
                  }),
              }}
            />
          </div>
        </div>
      </section>
    </li>
  );
};

export default FaqItem;
