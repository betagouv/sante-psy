import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox, Row, Col, TextInput } from '@dataesr/react-dsfr';
import { observer } from 'mobx-react';

import Page from 'components/Page/Page';

import agent from 'services/agent';

import { useStore } from 'stores/';

import PsyTable from './PsyTable';

import styles from './psyListing.cssmodule.scss';

let lastSearch;

const PsyListing = () => {
  const { commonStore: { psychologists, setPsychologists, lastAddressSearch, setLastAddressSearch } } = useStore();
  const query = new URLSearchParams(useLocation().search);

  const [nameFilter, setNameFilter] = useState(query.get('name') || '');
  const [addressFilter, setAddressFilter] = useState(query.get('address') || '');
  const [teleconsultation, setTeleconsultation] = useState(query.get('teleconsultation') === 'true' || false);
  const [page, setPage] = useState(0);

  const getPsychologists = () => {
    if (!addressFilter || addressFilter.trim() === '') {
      agent.Psychologist.find().then(returnedPsychologists => {
        setPsychologists(returnedPsychologists);
        setLastAddressSearch('');
      });
    } else {
      agent.Psychologist.findByAddress(addressFilter).then(returnedPsychologists => {
        setPsychologists(returnedPsychologists);
        setLastAddressSearch(addressFilter);
      });
    }
  };

  useEffect(() => {
    if (!psychologists) {
      getPsychologists();
    }
  }, []);

  useEffect(() => {
    if (lastAddressSearch !== addressFilter) {
      getPsychologists();
    }
  }, [addressFilter]);

  useEffect(() => {
    if (page === 0) {
      setPage(query.get('page') || 1);
    } else {
      setPage(1);
    }

    logSearchInMatomo();
  }, [nameFilter, addressFilter, teleconsultation]);

  const logSearchInMatomo = () => {
    if (__MATOMO__) {
      if (lastSearch) {
        clearTimeout(lastSearch);
      }

      let search = '';
      if (nameFilter) {
        search += `name=${nameFilter};`;
      }
      if (addressFilter) {
        search += `address=${addressFilter};`;
      }
      if (teleconsultation) {
        search += `teleconsultation=${teleconsultation};`;
      }

      if (search) {
        lastSearch = setTimeout(
          () => {
            _paq.push(['trackEvent', 'Search', 'Psychologist', search]);
          },
          2500,
        );
      }
    }
  };

  const isDepartment = () => {
    const departementFilter = +addressFilter;
    return departementFilter
    && (
      (departementFilter > 0 && departementFilter < 96)
    || (departementFilter > 970 && departementFilter < 977)
    );
  };

  const matchFilter = (value, filter) => value && value.toLowerCase().includes(filter.toLowerCase());

  const getFilteredPsychologists = () => {
    if (!psychologists) {
      return [];
    }

    return psychologists.filter(psychologist => {
      if (teleconsultation && !psychologist.teleconsultation) {
        return false;
      }

      if (nameFilter && !(
        matchFilter(psychologist.lastName, nameFilter)
        || matchFilter(`${psychologist.lastName} ${psychologist.firstNames}`, nameFilter)
        || matchFilter(`${psychologist.firstNames} ${psychologist.lastName}`, nameFilter)
      )
      ) {
        return false;
      }

      if (isDepartment()) {
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
      description={psychologists
        ? `Il y a actuellement ${psychologists.length} partenaires du dispositif d‘accompagnement.
      La liste est mise à jour quotidiennement, revenez la consulter si vous n‘avez pas pu trouver de psychologue.`
        : 'Chargement de la liste des psychologues'}
      background="yellow"
      dataTestId="psyListPage"
    >
      {psychologists && (
        <>
          <div className="fr-pb-6w">
            <Row gutters>
              <Col n="md-6 sm-12" className={styles.input}>
                <TextInput
                  className="fr-mb-1w"
                  value={nameFilter}
                  onChange={e => setNameFilter(e.target.value)}
                  label="Rechercher par nom"
                />
              </Col>
              <Col n="md-6 sm-12" className={styles.input}>
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
            page={page}
            setPage={setPage}
            psychologists={filteredPsychologists}
            nameFilter={nameFilter}
            addressFilter={addressFilter}
            teleconsultation={teleconsultation}
          />
        </>
      )}
    </Page>
  );
};

export default observer(PsyListing);
