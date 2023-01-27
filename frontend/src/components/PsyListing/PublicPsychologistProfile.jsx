import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Col, Row } from '@dataesr/react-dsfr';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import Page from 'components/Page/Page';
import Notification from 'components/Notification/Notification';

import agent from 'services/agent';
import string from 'services/string';
import distance from 'services/distance';

import styles from './publicPsychologistProfile.cssmodule.scss';

const getZoomLevel = psychologist => {
  if (!psychologist.otherLongitude || !psychologist.otherLatitude) {
    return 13;
  }

  const distanceKm = distance.distanceKm(
    psychologist.latitude,
    psychologist.longitude,
    psychologist.otherLatitude,
    psychologist.otherLongitude,
  );

  if (distanceKm < 5) {
    return 13;
  } if (distanceKm < 10) {
    return 11;
  } if (distanceKm < 40) {
    return 9;
  } if (distanceKm < 100) {
    return 7;
  }

  return 5;
};

const leftFields = [
  { name: 'Présentation', value: 'description' },
  {
    name: 'Disponibilité de téléconsultation',
    custom: psychologist => (
      psychologist.teleconsultation
        ? 'Téléconsultation possible'
        : 'Pas de téléconsultation possible'
    ),
  },
  { name: 'Langues parlées', value: 'languages' },
  {
    custom: psychologist => psychologist.longitude && psychologist.latitude && (
      <div className={styles.mapContainer}>
        <MapContainer
          center={[psychologist.latitude, psychologist.longitude]}
          zoom={getZoomLevel(psychologist)}
          scrollWheelZoom={false}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[psychologist.latitude, psychologist.longitude]} />
          {psychologist.otherLongitude && psychologist.otherLatitude && (
          <Marker position={[psychologist.otherLatitude, psychologist.otherLongitude]} />
          )}
        </MapContainer>
      </div>
    ),
  },
  { name: 'Adresse', value: 'address' },
  { name: 'Autre adresse', value: 'otherAddress' },
];

const rightFields = [
  { name: 'Téléphone', value: 'phone' },
  { name: 'Adresse email', value: 'email' },
  {
    name: 'Site web',
    custom: psychologist => (
      psychologist.website ? (
        <a
          href={string.prefixUrl(psychologist.website)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {psychologist.website}
        </a>
      )
        : null
    ),
  },
];

const PublicPsychologistProfile = () => {
  const { psyId } = useParams();
  const [error, setError] = useState();
  const [psychologist, setPsychologist] = useState();

  useEffect(() => {
    setError();
    agent.Psychologist.getProfile(psyId)
      .then(setPsychologist)
      .catch(() => {
        setError('Impossible de trouver les informations pour ce psychologue');
      });
  }, [psyId]);

  return (
    <Page
      breadCrumbs={[
        { href: '/', label: 'Accueil' },
        { href: '/trouver-un-psychologue', label: 'Trouver un psychologue' },
      ]}
      currentBreadCrumb={psychologist && `${psychologist.firstNames} ${psychologist.lastName.toUpperCase()}`}
      title={<b>Psychologue</b>}
      description={psychologist && `${psychologist.firstNames} ${psychologist.lastName.toUpperCase()}`}
      background="yellow"
      dataTestId="publicPsyProfilePage"
    >
      {error && <Notification message={error} type="error" />}
      {psychologist && (
        <Row className={styles.psyInfo}>
          <Col n="md-6 sm-12">
            {leftFields.map(field => {
              const value = field.value ? psychologist[field.value] : field.custom(psychologist);
              return value ? (
                <div key={field.name} className={styles.field} data-test-id="psy-info">
                  {field.name && (
                  <div className={styles.fieldName}>
                    {field.name}
                  </div>
                  )}
                  <div>
                    {value}
                  </div>
                </div>
              ) : null;
            })}
          </Col>
          <Col
            n="md-6 sm-12"
          >
            <h3>Contacter le psychologue</h3>
            {rightFields.map(field => {
              const value = field.value ? psychologist[field.value] : field.custom(psychologist);
              return value ? (
                <div key={field.name} className={styles.field} data-test-id="psy-info">
                  {field.name && (
                  <div className={styles.fieldName}>
                    {field.name}
                  </div>
                  )}
                  <div>
                    {value}
                  </div>
                </div>
              ) : null;
            })}
          </Col>
        </Row>
      )}
    </Page>
  );
};

export default PublicPsychologistProfile;
