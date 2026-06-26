import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, TextInput, Alert, Button } from '@dataesr/react-dsfr';
import { observer } from 'mobx-react';

import Page from 'components/Page/Page';
import AddressAutocomplete from 'components/AddressAutocomplete/AddressAutocomplete';

import agent from 'services/agent';

import { useStore } from 'stores/';

import GlobalNotification from 'components/Notification/GlobalNotification';
import PsyTable from './PsyTable';
import NoResultPsyTable from './NoResultPsyTable';

import { useSearchParams } from 'react-router-dom';
import styles from './psyListing.cssmodule.scss';
import { trackSearchPsychologists } from 'services/matomo';

export const AROUND_ME = 'Autour de moi';

const geoStatusEnum = {
  UNSUPPORTED: -2,
  DENIED: -1,
  UNKNOWN: 0,
  GRANTED: 1,
};

const PsyListing = () => {
  const {
    commonStore: { setNotification },
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const [hasSearched, setHasSearched] = useState(false);

  const [userCoords, setUserCoords] = useState(null);

  const [coords, setCoords] = useState(
    searchParams.get('lat') && searchParams.get('lon')
      ? {
          latitude: searchParams.get('lat'),
          longitude: searchParams.get('lon'),
        }
      : null,
  );
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [geoStatus, setGeoStatus] = useState(geoStatusEnum.UNKNOWN);
  const [nameAndSpecialityFilter, setNameAndSpecialityFilter] = useState(
    searchParams.get('name') || '',
  );
  const [languageFilter, setLanguageFilter] = useState(
    searchParams.get('language') || '',
  );
  const [addressFilter, setAddressFilter] = useState(
    searchParams.get('address') || '',
  );
  const [addressFilterObject, setAddressFilterObject] = useState(
    JSON.parse(searchParams.get('addressObject')) || null,
  );
  const [teleconsultation, setTeleconsultation] = useState(
    searchParams.get('teleconsultation') === 'true' || false,
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '0', 10),
  );

  const fetchPsychologists = async ({
    name,
    address,
    addressObject,
    language,
    teleconsultation,
    coords,
    page,
  }) => {
    let addressValue = address !== AROUND_ME ? address : undefined;
    if (addressObject && typeof addressObject === 'object') {
      addressValue = JSON.stringify({
        label: addressObject.label,
        value: addressObject.value,
        type: addressObject.type,
        postcode: addressObject.postcode,
        city: addressObject.city,
        context: addressObject.context,
      });
    }

    let filters = {
      nameAndSpeciality: name || undefined,
      address: addressValue,
      teleconsultation,
      language: language || undefined,
      ...(coords !== null && { coords }),
    };

    try {
      const response = await agent.Psychologist.find(filters);
      setFilteredPsychologists(response);
      setPage(page);

      if (__MATOMO__) {
        trackSearchPsychologists(
          name,
          language,
          address,
          addressObject,
          teleconsultation,
        );
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des psychologues :', error);
    }
  };

  useEffect(() => {
    const name = searchParams.get('name') || '';
    const language = searchParams.get('language') || '';
    const teleconsultation =
      searchParams.get('teleconsultation') === 'true' || false;
    const address = searchParams.get('address') || '';
    const addressObject = JSON.parse(searchParams.get('addressObject')) || null;
    const coords =
      searchParams.get('lat') && searchParams.get('lon')
        ? {
            latitude: parseFloat(searchParams.get('lat')),
            longitude: parseFloat(searchParams.get('lon')),
          }
        : null;
    const page = parseInt(searchParams.get('page') || '0', 10);

    const isAddressValid =
      !addressFilter || addressFilter === AROUND_ME || addressFilterObject;

    if (!isAddressValid) {
      setNotification(
        {
          message:
            'Veuillez sélectionner une ville ou région dans la liste proposée.',
        },
        false,
        false,
      );
      return;
    }

    if (!name && !language && !address && !teleconsultation) {
      setFilteredPsychologists([]);
      setPage(0);
      if (hasSearched) {
        setNotification(
          {
            message: 'Veuillez entrer au moins un critère de recherche.',
          },
          false,
          false,
        );
      }
      return;
    }
    setNotification(null);

    fetchPsychologists({
      name,
      language,
      address,
      addressObject,
      teleconsultation,
      coords,
      page,
    });
  }, [searchParams]);

  const handleSearch = () => {
    setHasSearched(true);
    setSearchParams({
      name: nameAndSpecialityFilter,
      language: languageFilter,
      teleconsultation,
      address: addressFilter,
      addressObject: JSON.stringify(addressFilterObject),
      ...(coords?.latitude && { lat: coords?.latitude }),
      ...(coords?.longitude && { lon: coords?.longitude }),
      page: 1,
    });
  };

  useEffect(() => {
    checkGeolocationPermission();
  }, []);

  useEffect(() => {
    if (addressFilter === AROUND_ME && userCoords) {
      setCoords(userCoords);
    }
  }, [addressFilter]);

  const success = (pos) => {
    const { longitude, latitude } = pos.coords;
    setUserCoords({ longitude, latitude });
    setGeoStatus(geoStatusEnum.GRANTED);
  };

  const errors = () => {
    setGeoStatus(geoStatusEnum.DENIED);
    setUserCoords(null);
  };

  const searchButtonRef = useRef(null);

  const getGeolocation = (state) => {
    if (state === 'granted') {
      navigator.geolocation.getCurrentPosition(success);
    } else if (state === 'prompt') {
      navigator.geolocation.getCurrentPosition(success, errors);
    } else if (state === 'denied') {
      setGeoStatus(geoStatusEnum.DENIED);
    }
  };

  const checkGeolocationPermission = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        getGeolocation(result.state);
      });
    } else {
      setGeoStatus(geoStatusEnum.UNSUPPORTED);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title={
        <>
          Trouver un <b>psychologue</b>
        </>
      }
      description="Parmi plus de 1 600 psychologues partenaires partout en France"
      dataTestId="psyListPage"
    >
      <>
        <GlobalNotification />
        <div className="fr-pb-6w fr-mt-2w">
          <div
            className={styles.filters}
            onKeyDown={(e) => {
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
                onChange={(value) => {
                  if (typeof value === 'object' && value !== null) {
                    setAddressFilter(value.label || value.value || '');
                    setAddressFilterObject(value);
                    if (value.coordinates) {
                      const [longitude, latitude] = value.coordinates;
                      setCoords({
                        latitude,
                        longitude,
                      });
                    }
                  } else {
                    setAddressFilter('');
                    setAddressFilterObject(null);
                    setCoords(null);
                  }
                }}
                placeholder="Ville, code postal ou région"
              />
            </div>
            <div className={styles.inputMd}>
              <TextInput
                data-test-id="name-speciality-input"
                value={nameAndSpecialityFilter}
                onChange={(e) => setNameAndSpecialityFilter(e.target.value)}
                placeholder="Spécialité, mot-clé, nom du psychologue..."
              />
            </div>
            <div className={styles.input}>
              <TextInput
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                placeholder="Langue parlée"
              />
            </div>
            <Checkbox
              value="teleconsultation"
              onChange={(e) => {
                setTeleconsultation(e.target.checked);
              }}
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
                  {filteredPsychologists.length}{' '}
                  {filteredPsychologists.length === 1
                    ? 'résultat'
                    : 'résultats'}
                </b>
              </div>
            )}
          </div>

          {addressFilter === AROUND_ME &&
            geoStatus === geoStatusEnum.DENIED && (
              <Alert
                className="fr-mt-2w"
                type="error"
                description="Veuillez autoriser la géolocalisation sur votre navigateur pour utiliser cette
                    fonctionnalité."
              />
            )}
          {addressFilter === AROUND_ME &&
            geoStatus === geoStatusEnum.UNSUPPORTED && (
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
          addressFilterObject={addressFilterObject}
          languageFilter={languageFilter}
          teleconsultation={teleconsultation}
          nameFilter={nameAndSpecialityFilter}
          coords={coords}
        />
        {page !== 0 &&
        filteredPsychologists &&
        filteredPsychologists.length < 8 ? (
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
