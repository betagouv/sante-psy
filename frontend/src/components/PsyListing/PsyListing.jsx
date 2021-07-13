import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox, Row, Col, TextInput } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';

import agent from 'services/agent';

import PsyTable from './PsyTable';

const PsyListing = () => {
  const query = new URLSearchParams(useLocation().search);

  const [psychologists, setPsychologists] = useState([]);
  const [nameFilter, setNameFilter] = useState(query.get('name') || '');
  const [addressFilter, setAddressFilter] = useState(query.get('address') || '');
  const [teleconsultation, setTeleconsultation] = useState(query.get('teleconsultation') === 'true' || false);

  useEffect(() => {
    agent.Psychologist.find().then(setPsychologists);
  }, []);

  const matchFilter = (value, filter) => value.toLowerCase().includes(filter.toLowerCase());

  const getFilteredPsychologists = () => {
    const departementFilter = +addressFilter;
    const addressIsDepartment = departementFilter
    && (
      (departementFilter > 0 && departementFilter < 96)
    || (departementFilter > 970 && departementFilter < 977)
    );

    return psychologists.filter(psychologist => {
      if (teleconsultation && !psychologist.teleconsultation) {
        return false;
      }

      if (nameFilter && !matchFilter(psychologist.lastName, nameFilter)) {
        return false;
      }

      if (addressIsDepartment) {
        if (!matchFilter(psychologist.departement, addressFilter)) {
          return false;
        }
      } else if (addressFilter
        && !(
          matchFilter(psychologist.address, addressFilter)
          || matchFilter(psychologist.departement, addressFilter)
          || matchFilter(psychologist.region, addressFilter)
        )
      ) {
        return false;
      }

      return true;
    });
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
        <Row gutters>
          <Col n="md-6 sm-12">
            <TextInput
              className="fr-mb-1w"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
              label="Rechercher par nom"
            />
          </Col>
          <Col n="md-6 sm-12">
            <TextInput
              className="fr-mb-1w"
              value={addressFilter}
              onChange={e => setAddressFilter(e.target.value)}
              label="Rechercher par ville, code postal ou région"
            />
          </Col>
        </Row>
        <Checkbox
          value="teleconsultation"
          onChange={e => { setTeleconsultation(e.target.checked); }}
          label="Disponible en téléconsultation"
          defaultChecked={teleconsultation}
        />
      </div>
      <PsyTable
        psychologists={filteredPsychologists}
        nameFilter={nameFilter}
        addressFilter={addressFilter}
        teleconsultation={teleconsultation}
      />
    </Page>
  );
};

export default PsyListing;
