import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import agent from 'services/agent';
import Page from 'components/Page/Page';
import { Checkbox, TextInput } from '@dataesr/react-dsfr';
import PsyTable from './PsyTable';

const PsyListing = () => {
  const query = new URLSearchParams(useLocation().search);

  const [psychologists, setPsychologists] = useState([]);
  const [filter, setFilter] = useState(query.get('search') || '');
  const [teleconsultation, setTeleconsultation] = useState(query.get('teleconsultation') || false);

  useEffect(() => {
    agent.Psychologist.find().then(response => {
      setPsychologists(response.psyList);
    });
  }, []);

  const matchFilter = value => value.toLowerCase().includes(filter.toLowerCase());

  const getFilteredPsychologists = () => {
    let filteredPsychologists = psychologists;
    if (teleconsultation) {
      filteredPsychologists = filteredPsychologists.filter(psychologist => psychologist.teleconsultation);
    }

    if (!filter) {
      return filteredPsychologists;
    }

    const psychologistByName = filteredPsychologists
      .filter(
        psychologist => matchFilter(psychologist.lastName),
      );
    const psychologistByAddress = filteredPsychologists.filter(
      psychologist => (
        !matchFilter(psychologist.lastName)
        && (
          matchFilter(psychologist.address)
        || matchFilter(psychologist.departement)
        || matchFilter(psychologist.region)
        )
      ),
    );
    return psychologistByName.concat(psychologistByAddress);
  };

  const filteredPsychologists = getFilteredPsychologists();

  return (
    <Page
      title="Trouver un psychologue"
      description={`Il y a actuellement ${psychologists.length} partenaires du dispositif d‘accompagnement.
      La liste est mise à jour quotidiennement, revenez la consulter si vous n‘avez pas pu trouver de psychologue.`}
      background="yellow"
      dataTestId="psyListPage"
    >
      <div className="fr-pb-6w">
        <TextInput
          className="fr-mb-1w"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          label="Rechercher par nom, ville, code postal ou région"
        />
        <Checkbox
          value="teleconsultation"
          onChange={e => { setTeleconsultation(e.target.checked); }}
          label="Disponible en téléconsultation"
          defaultChecked={teleconsultation === 'true'}
        />
      </div>
      <PsyTable
        psychologists={filteredPsychologists}
        filter={filter}
        teleconsultation={teleconsultation}
      />
    </Page>
  );
};

export default PsyListing;
