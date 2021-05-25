import React from 'react';

const Section = ({ title, subtitle, sections }) => (
  <div className="fr-container--fluid fr-bg--alt fr-centered fr-pb-2w fr-pt-2w">
    <div className="fr-grid-row fr-grid-row--center">
      <div className="fr-col-xs-12">
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>
    </div>

    <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
      {sections.map(section => (
        <div className="fr-col-xs-12 fr-col-md-3" key={section.title}>
          <div className="fr-text--lg fr-pb-2w fr-mb-1v">{section.title}</div>
          <div className="fr-text--sm fr-mb-1v">{section.text}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Section;
