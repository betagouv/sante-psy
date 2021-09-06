import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox, Row, Col, TextInput, Button, Alert } from '@dataesr/react-dsfr';
import { observer } from 'mobx-react';

import Page from 'components/Page/Page';

import agent from 'services/agent';
import utils from 'services/search';
import distance from 'services/distance';

import { useStore } from 'stores/';

import PsyTable from './PsyTable';

import styles from './psyListing.cssmodule.scss';

let lastSearch;

const PsyListing = () => {
  const { commonStore: { psychologists, setPsychologists } } = useStore();
  const query = new URLSearchParams(useLocation().search);

  const [coords, setCoords] = useState();
  const [geoAccessDenied, setGeoAccessDenied] = useState(false);
  const [nameFilter, setNameFilter] = useState(query.get('name') || '');
  const [addressFilter, setAddressFilter] = useState(query.get('address') || '');
  const [teleconsultation, setTeleconsultation] = useState(query.get('teleconsultation') === 'true' || false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!psychologists) {
      agent.Psychologist.find().then(setPsychologists);
    }
  }, []);

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

  const success = pos => {
    console.debug('Geolocation retrieved');
    const { longitude, latitude } = pos.coords;
    setCoords({ longitude, latitude });
    setGeoAccessDenied(false);
  };

  const errors = err => {
    console.debug(err.message);
    setGeoAccessDenied(true);
  };

  const getGeolocation = state => {
    console.debug('Geolocation', state);
    if (state === 'granted') {
      navigator.geolocation.getCurrentPosition(success);
    } else if (state === 'prompt') {
      navigator.geolocation.getCurrentPosition(success, errors);
    } else if (state === 'denied') {
      setGeoAccessDenied(true);
    }
  };

  const checkGeolocationPermission = () => {
    console.debug('Geolocation permission check');
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(result => {
          getGeolocation(result.state);
        });
    } else {
      console.warn('Geolocation unavailable');
    }
  };

  const getFilteredPsychologists = () => {
    if (!psychologists) {
      return [];
    }
    const departementFilter = +addressFilter;
    const addressIsDepartment = departementFilter
      && (
        (departementFilter > 0 && departementFilter < 96)
        || (departementFilter > 970 && departementFilter < 977)
      );

    const filteredPsychologists = psychologists.filter(psychologist => {
      if (teleconsultation && !psychologist.teleconsultation) {
        return false;
      }

      if (nameFilter && !(
        utils.matchFilter(psychologist.lastName, nameFilter)
        || utils.matchFilter(`${psychologist.lastName} ${psychologist.firstNames}`, nameFilter)
        || utils.matchFilter(`${psychologist.firstNames} ${psychologist.lastName}`, nameFilter)
      )
      ) {
        return false;
      }

      if (addressIsDepartment) {
        if (!utils.matchDepartment(psychologist.address, addressFilter)) {
          return false;
        }
      } else if (addressFilter
        && !(
          utils.matchZipCodeOrCity(psychologist.address, addressFilter)
          || utils.matchFilter(psychologist.departement, addressFilter)
          || utils.matchFilter(psychologist.region, addressFilter)
        )
      ) {
        return false;
      }

      return true;
    });

    if (coords && coords.longitude) {
      console.debug("Sort by distance from", coords.longitude, coords.latitude);
      return filteredPsychologists.sort((psyA, psyB) => distance.comparator(psyA, psyB, coords));
    }
    return filteredPsychologists;
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
            <Row gutters>
              <Col n="md-6 sm-12" className={styles.input}>
                <Checkbox
                  value="teleconsultation"
                  onChange={e => { setTeleconsultation(e.target.checked); }}
                  label="Disponible en téléconsultation"
                  defaultChecked={teleconsultation}
                />
              </Col>
              <Col n="md-6 sm-12" className={styles.input}>
                <Button
                  icon="fr-fi-search-line"
                  onClick={checkGeolocationPermission}
                >
                  Rechercher autour de moi
                </Button>
                {geoAccessDenied && (
                  <Alert
                    className="fr-mt-1w"
                    type="error"
                    description="Veuillez autoriser la géolocalisation sur votre navigateur pour utiliser cette
                    fonctionnalité."
                  />
                )}
              </Col>
            </Row>

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
