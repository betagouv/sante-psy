import React, { useEffect, useState } from 'react';

import Ariane from 'components/Ariane/Ariane';
import agent from 'services/agent';
import PsyTable from './PsyTable';

const PsyListing = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    agent.Psychologist.find().then(setPsychologists);
  }, []);

  const filterByKey = (psychologist, key, psyKey) => {
    const filterValue = filter[key];
    if (!filterValue) {
      return true;
    }
    const psychologistValue = psychologist[psyKey || key];
    return psychologistValue && psychologistValue.toLowerCase().includes(filterValue);
  };

  const getFilteredPsychologists = () => psychologists.filter(
    psychologist => filterByKey(psychologist, 'name', 'lastName')
        && filterByKey(psychologist, 'address')
        && filterByKey(psychologist, 'postCode', 'departement'),
  );

  const changeFilter = (name, event) => {
    const newFilter = { ...filter };
    newFilter[name] = event.target.value.toLowerCase();
    setFilter(newFilter);
  };

  return (
    <div className="fr-container">
      <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div className="fr-container fr-mb-3w">
          <Ariane
            previous={[{
              label: 'Accueil',
              url: '/',
            }]}
            current="Trouver un psychologue"
          />
          <h1>Trouver un psychologue</h1>
          <p className="fr-mb-2w">
            Il y a actuellement
            {` ${psychologists.length} `}
            partenaires du dispositif d&lsquo;accompagnement.
            <br />
            La liste est mise à jour quotidiennement,
            revenez la consulter si vous n&lsquo;avez pas pu trouver de psychologue.
          </p>
          <p className="fr-mb-2w">
            Vous pouvez contacter un psychologue partenaire dans n&lsquo;importe quel département,
            peu importe votre université d&lsquo;origine, par téléphone,
            email ou par son site web.
          </p>

          <div className="fr-input-group">
            <label
              className="fr-label"
              htmlFor="lastName-filter-value"
            >
              Rechercher par nom :
            </label>
            <input
              className="fr-input midlength-input"
              id="lastName-filter-value"
              type="text"
              placeholder="Delgado"
              onChange={event => changeFilter('name', event)}
            />
          </div>
          <div className="fr-input-group">
            <label
              className="fr-label"
              htmlFor="address-filter-value"
            >
              Rechercher votre ville ou code postal :
            </label>
            <input
              className="fr-input midlength-input"
              id="address-filter-value"
              type="text"
              placeholder="Amiens ou 80000"
              onChange={event => changeFilter('address', event)}
            />
          </div>
          <div className="fr-input-group">
            <label
              className="fr-label"
              htmlFor="departement-filter-value"
            >
              Rechercher par département:
            </label>
            <input
              className="fr-input midlength-input"
              id="departement-filter-value"
              type="text"
              placeholder="Somme ou 80"
              onChange={event => changeFilter('postCode', event)}
            />
          </div>
          <PsyTable psychologists={getFilteredPsychologists()} />
        </div>
      </div>
    </div>
  );
};

export default PsyListing;
