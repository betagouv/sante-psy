import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import agent from 'services/agent';
import Page from 'components/Page/Page';
import { TextInput } from '@dataesr/react-dsfr';
import PsyTable from './PsyTable';

const PsyListing = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [filter, setFilter] = useState('');
  const { search } = useParams();

  useEffect(() => {
    agent.Psychologist.find().then(response => {
      setPsychologists(response.psyList);
    });
  }, []);

  useEffect(() => {
    if (search) {
      setFilter(search);
    }
  }, search);

  const getFilteredPsychologists = () => {
    if (!filter) {
      return psychologists;
    }

    const psychologistByName = psychologists
      .filter(
        psychologist => psychologist.lastName.toLowerCase().includes(filter.toLowerCase()),
      );
    const psychologistByAddress = psychologists.filter(
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
      {filteredPsychologists.length > 0 && <PsyTable psychologists={filteredPsychologists} />}
    </Page>
  );
};

export default PsyListing;
