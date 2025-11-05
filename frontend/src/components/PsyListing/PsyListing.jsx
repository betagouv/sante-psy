import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox, TextInput, Alert, Button } from '@dataesr/react-dsfr';
import { observer } from 'mobx-react';

import Page from 'components/Page/Page';
import AddressAutocomplete from 'components/AddressAutocomplete/AddressAutocomplete';

import agent from 'services/agent';

import { useStore } from 'stores/';

import GlobalNotification from 'components/Notification/GlobalNotification';
import PsyTable from './PsyTable';
import NoResultPsyTable from './NoResultPsyTable';

import styles from './psyListing.cssmodule.scss';

const AROUND_ME = 'Autour de moi';

const geoStatusEnum = {
  UNSUPPORTED: -2,
  DENIED: -1,
  UNKNOWN: 0,
  GRANTED: 1,
};

const PsyListing = () => {
  const { commonStore: { setNotification, psychologists, setPsychologists } } = useStore();
  const query = new URLSearchParams(useLocation().search);

  const [coords, setCoords] = useState();
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [geoStatus, setGeoStatus] = useState(geoStatusEnum.UNKNOWN);
  const [geoLoading, setGeoLoading] = useState(false);
  const [nameAndSpecialityFilter, setNameAndSpecialityFilter] = useState(query.get('nameAndSpeciality') || '');
  const [languageFilter, setLanguageFilter] = useState(query.get('language') || '');
  const [addressFilter, setAddressFilter] = useState(query.get('address') || '');
  const [addressFilterObject, setAddressFilterObject] = useState(null);
  const [teleconsultation, setTeleconsultation] = useState(query.get('teleconsultation') === 'true' || false);
  const [page, setPage] = useState(0);

  const fetchPsychologists = async () => {
    let addressValue = addressFilter !== AROUND_ME ? addressFilter : undefined;

    if (addressFilterObject && typeof addressFilterObject === 'object') {
      addressValue = JSON.stringify({
        label: addressFilterObject.label,
        value: addressFilterObject.value,
        type: addressFilterObject.type,
        postcode: addressFilterObject.postcode,
        city: addressFilterObject.city,
        context: addressFilterObject.context,
      });
    }

    const filters = {
      nameAndSpeciality: nameAndSpecialityFilter || undefined,
      address: addressValue,
      teleconsultation,
      language: languageFilter || undefined,
      coords: addressFilter === AROUND_ME && coords ? `${coords.latitude},${coords.longitude}` : undefined,
    };

    try {
      const response = await agent.Psychologist.find(filters);
      setPsychologists(response);
      setFilteredPsychologists(response);

      if (__MATOMO__) {
        const usedFilters = [];

        if (nameAndSpecialityFilter && nameAndSpecialityFilter.trim()) {
          _paq.push(['trackEvent', 'AnnuairePsy', 'SpecialitySearch', nameAndSpecialityFilter.trim()]);
          usedFilters.push('speciality');
        }

        if (languageFilter && languageFilter.trim()) {
          _paq.push(['trackEvent', 'AnnuairePsy', 'LanguageSearch', languageFilter.trim()]);
          usedFilters.push('language');
        }

        if (addressFilterObject && addressFilterObject.label) {
          _paq.push(['trackEvent', 'AnnuairePsy', 'LocationSearch', addressFilterObject.label]);
          usedFilters.push('location');
        } else if (addressFilter === AROUND_ME) {
          _paq.push(['trackEvent', 'AnnuairePsy', 'LocationSearch', 'Géolocalisation']);
          usedFilters.push('location');
        }

        _paq.push(['trackEvent', 'AnnuairePsy', 'TeleconsultationFilter', teleconsultation ? 'enabled' : 'disabled']);
        if (teleconsultation) {
          usedFilters.push('teleconsultation');
        }

        if (usedFilters.length > 0) {
          _paq.push(['trackEvent', 'AnnuairePsy', 'SearchProfile', usedFilters.sort().join('+')]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des psychologues :', error);
    }
  };

  const handleSearch = () => {
    const isAddressValid = !addressFilter || addressFilter === AROUND_ME || addressFilterObject;

    if (!isAddressValid) {
      setNotification(
        { message: 'Veuillez sélectionner une ville ou région dans la liste proposée.' },
        false,
        false,
      );
      return;
    }

    if (
      nameAndSpecialityFilter.trim()
      || languageFilter.trim()
      || addressFilter.trim()
      || teleconsultation
    ) {
      setNotification(null);
      fetchPsychologists();
      setPage(1);
    } else {
      setFilteredPsychologists([]);
      setPage(0);
      setNotification(
        {
          message: (
            'Veuillez entrer au moins un critère de recherche.'
          ),
        },
        false,
        false,
      );
    }
  };

  useEffect(() => {
    if (addressFilter === AROUND_ME) {
      checkGeolocationPermission();
    }
  }, [addressFilter, coords]);

  const success = pos => {
    const { longitude, latitude } = pos.coords;
    setCoords({ longitude, latitude });
    setGeoStatus(geoStatusEnum.GRANTED);
    setGeoLoading(false);
  };

  const errors = () => {
    setGeoStatus(geoStatusEnum.DENIED);
  };

  const searchButtonRef = useRef(null);

  const getGeolocation = state => {
    if (state === 'granted') {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(success);
    } else if (state === 'prompt') {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(success, errors);
    } else if (state === 'denied') {
      setGeoStatus(geoStatusEnum.DENIED);
    }
  };

  const checkGeolocationPermission = () => {
    if (!coords) {
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(result => {
            getGeolocation(result.state);
          });
      } else {
        setGeoStatus(geoStatusEnum.UNSUPPORTED);
      }
    }
  };

  const handlePageChange = newPage => {
    setPage(newPage);
    fetchPsychologists();
  };

  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title={(
        <>
          Trouver un
          {' '}
          <b>psychologue</b>
        </>
      )}
      description={psychologists
        ? 'Parmi plus de 1 200 psychologues partenaires partout en France'
        : 'Chargement de la liste des psychologues'}
      dataTestId="psyListPage"
    >
      <>
        <GlobalNotification />
        <div className="fr-pb-6w fr-mt-2w">
          <div className={styles.filters}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
                searchButtonRef.current?.focus();
              }
            }}
          >
            <div className={styles.input}>
              <AddressAutocomplete
                selected={addressFilter}
                onChange={value => {
                  if (typeof value === 'object' && value !== null) {
                    setAddressFilter(value.label || value.value || '');
                    setAddressFilterObject(value);
                  } else if (typeof value === 'string') {
                    setAddressFilter(value);
                    setAddressFilterObject(null);
                  } else {
                    setAddressFilter('');
                    setAddressFilterObject(null);
                  }
                }}
                placeholder="Ville, code postal ou région"
              />
            </div>
            <div className={styles.inputMd}>
              <TextInput
                data-test-id="name-speciality-input"
                value={nameAndSpecialityFilter}
                onChange={e => setNameAndSpecialityFilter(e.target.value)}
                placeholder="Spécialité, mot-clé, nom du psychologue..."
              />
            </div>
            <div className={styles.input}>
              <TextInput
                value={languageFilter}
                onChange={e => setLanguageFilter(e.target.value)}
                placeholder="Langue parlée"
              />
            </div>
            <Checkbox
              value="teleconsultation"
              onChange={e => { setTeleconsultation(e.target.checked); }}
              label="Téléconsultation"
              checked={teleconsultation}
            />
            <Button
              ref={searchButtonRef}
              data-test-id="psy-search"
              onClick={handleSearch}
              icon="ri-search-line"
              iconPosition="left"
            >
              Rechercher
            </Button>
          </div>
          <div className={styles.resultsCount}>
            {filteredPsychologists && filteredPsychologists.length > 0 && (
              <div className={styles.number}>
                <b>
                  {filteredPsychologists.length}
                  {' '}
                  {filteredPsychologists.length === 1 ? 'résultat' : 'résultats'}
                </b>
              </div>
            )}
          </div>

          {addressFilter === AROUND_ME && geoStatus === geoStatusEnum.DENIED && (
            <Alert
              className="fr-mt-2w"
              type="error"
              description="Veuillez autoriser la géolocalisation sur votre navigateur pour utiliser cette
                    fonctionnalité."
            />
          )}
          {addressFilter === AROUND_ME && geoStatus === geoStatusEnum.UNSUPPORTED && (
            <Alert
              className="fr-mt-1w"
              type="error"
              description="Votre navigateur ne permet pas d'utiliser cette fonctionnalité."
            />
          )}
        </div>
        <Alert
          type="warning"
          title="Vous n‘avez aucune avance de frais à prévoir"
          description="Le psychologue ne doit en aucun cas vous demander un complément financier ou une avance."
        />
        <PsyTable
          page={page}
          setPage={handlePageChange}
          psychologists={filteredPsychologists || []}
          nameAndSpecialityFilter={nameAndSpecialityFilter}
          addressFilter={addressFilter}
          languageFilter={languageFilter}
          teleconsultation={teleconsultation}
          geoLoading={geoLoading}
        />
        {page !== 0 && filteredPsychologists && filteredPsychologists.length < 8
          ? (
            <NoResultPsyTable
              noResult={filteredPsychologists.length === 0}
              searchAroundMe={() => {
                setNameAndSpecialityFilter('');
                setAddressFilter(AROUND_ME);
              }}
              searchWithTeleconsultation={() => {
                setNameAndSpecialityFilter('');
                setAddressFilter(null);
                setTeleconsultation(true);
              }}
            />
          ) : (
            <Alert
              title="Attention, en cas de séance non honorée et sans excuse valable"
              description="Le psychologue peut se réserver le droit de refuser un étudiant"
            />
          )}
      </>
    </Page>
  );
};

export default observer(PsyListing);
