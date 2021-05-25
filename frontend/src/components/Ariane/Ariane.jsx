import React from 'react';
import { HashLink } from 'react-router-hash-link';

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
            {item.url ? <HashLink to={item.url}>{item.label}</HashLink> : item.label}
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
