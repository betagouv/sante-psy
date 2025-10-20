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

let lastSearch;

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
  const [teleconsultation, setTeleconsultation] = useState(query.get('teleconsultation') === 'true' || false);
  const [page, setPage] = useState(0);

  const fetchPsychologists = async () => {
    const filters = {
      nameAndSpeciality: nameAndSpecialityFilter || undefined,
      address: addressFilter !== AROUND_ME ? addressFilter : undefined,
      teleconsultation,
      language: languageFilter || undefined,
      coords: addressFilter === AROUND_ME && coords ? `${coords.latitude},${coords.longitude}` : undefined,
    };

    try {
      const response = await agent.Psychologist.find(filters);
      setPsychologists(response);
      setFilteredPsychologists(response);

      if (__MATOMO__) {
        _paq.push(['trackEvent', 'PsychologistSearch', 'Results', (response?.length || 0).toString()]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des psychologues :', error);

      if (__MATOMO__) {
        _paq.push(['trackEvent', 'PsychologistSearch', 'Error', 'api_error']);
      }
    }
  };

  const handleSearch = () => {
    // Vérifie si au moins un filtre est défini
    if (
      nameAndSpecialityFilter.trim()
      || languageFilter.trim()
      || addressFilter.trim()
      || teleconsultation
    ) {
      if (__MATOMO__) {
        let searchExecuted = '';
        if (nameAndSpecialityFilter) {
          searchExecuted += `speciality=${nameAndSpecialityFilter};`;
        }
        if (addressFilter) {
          searchExecuted += `location=${addressFilter};`;
        }
        if (languageFilter) {
          searchExecuted += `language=${languageFilter};`;
        }
        if (teleconsultation) {
          searchExecuted += 'teleconsultation=true;';
        }
        _paq.push(['trackEvent', 'PsychologistSearch', 'Execute', searchExecuted]);

        if (addressFilter) {
          if (addressFilter === AROUND_ME) {
            _paq.push(['trackEvent', 'LocationSearchExecuted', 'Geolocation', 'Autour de moi']);
          } else if (/^\d{5}$/.test(addressFilter.trim())) {
            _paq.push(['trackEvent', 'LocationSearchExecuted', 'PostalCode', addressFilter]);
          } else if (addressFilter.includes(' - ')) {
            _paq.push(['trackEvent', 'LocationSearchExecuted', 'Department', addressFilter]);
          } else {
            _paq.push(['trackEvent', 'LocationSearchExecuted', 'CityOrRegion', addressFilter]);
          }
        }
      }

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

      if (__MATOMO__) {
        _paq.push(['trackEvent', 'PsychologistSearch', 'EmptySearch', 'no_criteria']);
      }
    }
  };

  useEffect(() => {
    if (addressFilter === AROUND_ME) {
      checkGeolocationPermission();
    }

    logSearchInMatomo();
  }, [addressFilter, coords]);

  const logSearchInMatomo = () => {
    if (__MATOMO__) {
      if (lastSearch) {
        clearTimeout(lastSearch);
      }

      let search = '';
      if (nameAndSpecialityFilter) {
        search += `speciality=${nameAndSpecialityFilter};`;
      }
      if (addressFilter) {
        search += `location=${addressFilter};`;
      }
      if (languageFilter) {
        search += `language=${languageFilter};`;
      }
      if (teleconsultation) {
        search += `teleconsultation=${teleconsultation};`;
      }

      if (search) {
        lastSearch = setTimeout(
          () => {
            _paq.push(['trackEvent', 'PsychologistSearch', 'Input', search]);

            // Tracker spécifiquement les recherches géographiques
            if (addressFilter) {
              if (addressFilter === AROUND_ME) {
                _paq.push(['trackEvent', 'LocationSearch', 'Geolocation', 'Autour de moi']);
              } else {
                // Déterminer le type de lieu recherché
                if (/^\d{5}$/.test(addressFilter.trim())) {
                  _paq.push(['trackEvent', 'LocationSearch', 'PostalCode', addressFilter]);
                } else if (addressFilter.includes(' - ')) {
                  _paq.push(['trackEvent', 'LocationSearch', 'Department', addressFilter]);
                } else {
                  _paq.push(['trackEvent', 'LocationSearch', 'CityOrRegion', addressFilter]);
                }
              }
            }

            // Tracker spécifiquement les recherches de langues
            if (languageFilter) {
              _paq.push(['trackEvent', 'LanguageSearch', 'Language', languageFilter]);
            }

            // Tracker spécifiquement les recherches de spécialités
            if (nameAndSpecialityFilter) {
              _paq.push(['trackEvent', 'SpecialitySearch', 'Query', nameAndSpecialityFilter]);
            }
          },
          2500,
        );
      }
    }
  };

  const success = async pos => {
    const { longitude, latitude } = pos.coords;
    setCoords({ longitude, latitude });
    setGeoStatus(geoStatusEnum.GRANTED);
    setGeoLoading(false);

    // Récupérer l'adresse à partir des coordonnées pour les stats
    if (__MATOMO__) {
      try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const address = data.features[0].properties;
          const city = address.city || address.name;
          const { postcode } = address;
          const { context } = address;

          // Tracker la localisation réelle pour "autour de moi"
          _paq.push(['trackEvent', 'GeolocationDetected', 'City', city || 'unknown']);
          _paq.push(['trackEvent', 'GeolocationDetected', 'PostalCode', postcode || 'unknown']);
          _paq.push(['trackEvent', 'GeolocationDetected', 'Region', context || 'unknown']);
          _paq.push(['trackEvent', 'GeolocationDetected', 'FullAddress', `${city} ${postcode} - ${context}`]);
        }
      } catch (error) {
        console.error('Erreur géocodage inversé:', error);
        _paq.push(['trackEvent', 'GeolocationDetected', 'Error', 'reverse_geocoding_failed']);
      }
    }
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
                onChange={e => {
                  setAddressFilter(e);
                  if (__MATOMO__ && e && e !== addressFilter) {
                    let addressType = 'city';
                    if (e === AROUND_ME) {
                      addressType = 'geolocation';
                    } else if (/^\d+/.test(e)) {
                      addressType = 'postal_code';
                    } else if (e.includes(' - ')) {
                      addressType = 'department';
                    }

                    // Tracker le type de sélection
                    _paq.push(['trackEvent', 'AddressAutocomplete', 'Select', addressType]);

                    // Tracker la valeur exacte sélectionnée pour les statistiques géographiques
                    if (e === AROUND_ME) {
                      _paq.push(['trackEvent', 'AddressAutocomplete', 'SelectedValue', 'Geolocation']);
                    } else {
                      _paq.push(['trackEvent', 'AddressAutocomplete', 'SelectedValue', e]);
                    }
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
