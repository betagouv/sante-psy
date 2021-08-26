import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox, Row, Col, TextInput, Button } from '@dataesr/react-dsfr';
import { observer } from 'mobx-react';
import agent from 'services/agent';
import { useStore } from 'stores/';
import Page from 'components/Page/Page';
import PsyTable from './PsyTable';

import styles from './psyListing.cssmodule.scss';

const PsyListing = () => {
  const { commonStore: { statistics, setStatistics, searchPsychologists, setSearchPsychologists } } = useStore();
  const query = new URLSearchParams(useLocation().search);

  const [nameFilter, setNameFilter] = useState(query.get('name') || '');
  const [addressFilter, setAddressFilter] = useState(query.get('address') || '');
  const [teleconsultation, setTeleconsultation] = useState(query.get('teleconsultation') === 'true' || false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    resetPage();
    if (!statistics) {
      agent.Statistics.getAll().then(setStatistics);
    }
    if (!searchPsychologists || searchHasChanged()) {
      getPsychologists();
    }
  }, []);

  const resetPage = () => {
    if (page === 0) {
      setPage(query.get('page') || 1);
    } else {
      setPage(1);
    }
  };

  const searchHasChanged = () => nameFilter !== searchPsychologists.nameFilter
  || addressFilter !== searchPsychologists.addressFilter
  || teleconsultation !== searchPsychologists.teleconsultation;

  const getPsychologists = () => {
    agent.Psychologist.find(nameFilter, addressFilter, teleconsultation).then(psychologists => {
      setSearchPsychologists({
        psychologists,
        nameFilter,
        addressFilter,
        teleconsultation,
      });
    });
  };

  const onSearchButtonClick = () => {
    resetPage();
    if (searchHasChanged) {
      getPsychologists();
      logSearchInMatomo(); // TODO: should we log matomo only on change?
    }
  };

  const logSearchInMatomo = () => {
    if (__MATOMO__) {
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
        _paq.push(['trackEvent', 'Search', 'Psychologist', search]);
      }
    }
  };

  const nbPsychologists = statistics ? statistics.find(s => s.label === 'Psychologues partenaires').value : '';

  return (
    <Page
      title="Trouver un psychologue"
      description={`Il y a actuellement ${nbPsychologists} partenaires du dispositif d‘accompagnement.
      La liste est mise à jour quotidiennement, revenez la consulter si vous n‘avez pas pu trouver de psychologue.`}
      background="yellow"
      dataTestId="psyListPage"
    >
      {searchPsychologists && searchPsychologists.psychologists && (
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
            <Row gutters>
              <Col n="md-6 sm-12">
                <Checkbox
                  value="teleconsultation"
                  onChange={e => { setTeleconsultation(e.target.checked); }}
                  label="Disponible en téléconsultation"
                  defaultChecked={teleconsultation}
                />
              </Col>
              <Col n="md-6 sm-12">
                <Button
                  onClick={onSearchButtonClick}
                  className="fr-fi-search-line fr-btn--icon-left fr-float-right"
                >
                  Rechercher
                </Button>
              </Col>
            </Row>
          </div>
          <PsyTable
            page={page}
            setPage={setPage}
            psychologists={searchPsychologists.psychologists}
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
