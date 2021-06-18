import React from 'react';

import FaqItems from './FaqItems';

const FaqSection = ({ id, sections, title, flyers }) => (
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
      <ul key={section.name} className="fr-accordion-group">
        {section.title && <h2 id={section.id}>{section.title}</h2>}
        <FaqItems section={section.name} />
      </ul>
    ))}
  </>
);

export default FaqSection;
