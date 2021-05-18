import React from 'react';
import { Link } from 'react-router-dom';

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
            {item.url ? <Link to={item.url}>{item.label}</Link> : item.label}
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
