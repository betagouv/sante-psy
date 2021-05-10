import React from 'react';

const Ariane = ({ previous, current }) => (
  <>
    <nav className="fr-breadcrumb" aria-label="vous êtes ici :" role="navigation">
      <button
        type="button"
        className="fr-breadcrumb__button"
        hidden
      >
        Voir le fil d’Ariane
      </button>
      <ol className="fr-breadcrumb__list">
        {previous.map(item => (
          <li className="fr-breadcrumb__link" key={item.label}>
            {item.url ? <a href={item.url}>{item.label}</a> : item.label}
          </li>
        ))}
        <li
          className="fr-breadcrumb__link"
          aria-current="page"
        >
          {current}
        </li>
      </ol>
    </nav>
  </>
);

export default Ariane;
