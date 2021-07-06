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
        psychologist => psychologist.lastName.toLowerCase().includes(filter.toLowerCase()),
      );
    const psychologistByAddress = filteredPsychologists.filter(
      psychologist => (
        !psychologist.lastName.toLowerCase().includes(filter.toLowerCase())
        && (
          psychologist.address.toLowerCase().includes(filter.toLowerCase())
        || psychologist.departement.toLowerCase().includes(filter.toLowerCase())
        || psychologist.region.toLowerCase().includes(filter.toLowerCase())
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
    >
      <TextInput
        value={filter}
        onChange={e => setFilter(e.target.value)}
        label="Rechercher par nom, ville, code postal ou région"
      />
      <Checkbox
        value="teleconsultation"
        onChange={e => { setTeleconsultation(e.target.checked); }}
        label="Disponible en téléconsultation"
        defaultChecked={teleconsultation}
      />
      <PsyTable
        psychologists={filteredPsychologists}
        filter={filter}
        teleconsultation={teleconsultation}
      />
    </Page>
  );
};

export default PsyListing;
