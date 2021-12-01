import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Col, Row } from '@dataesr/react-dsfr';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import Page from 'components/Page/Page';
import Notification from 'components/Notification/Notification';

import agent from 'services/agent';
import string from 'services/string';
import distance from 'services/distance';

import styles from './publicPsychologistProfile.cssmodule.scss';

const fields = [
  { name: 'Adresse', value: 'address' },
  { name: 'Autre adresse', value: 'otherAddress' },
  { name: 'Téléphone', value: 'phone' },
  { name: 'Adresse email', value: 'email' },
  { name: 'Langues parlées', value: 'languages' },
  {
    name: 'Disponibilité de téléconsultation',
    custom: psychologist => (
      psychologist.teleconsultation
        ? 'Téléconsultation possible'
        : 'Pas de téléconsultation possible'
    ),
  },
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
  const navigate = useNavigate();
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

  const getZoomLevel = () => {
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
  return (
    <Page
      title="Profil psychologue"
      description="J'accède aux informations me permettant d'en apprendre plus sur un psychologue et de le contacter."
      background="yellow"
      dataTestId="publicPsyProfilePage"
    >
      <Row justifyContent="right">
        <Button
          className="fr-mb-3w"
          secondary
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
      </Row>
      {error && <Notification message={error} type="error" />}
      {psychologist && (
        <>
          <Row>
            <div key="name" className={styles.field} data-test-id="psy-name">
              <div className={styles.psyName}>
                {`${psychologist.lastName.toUpperCase()} ${psychologist.firstNames}`}
              </div>
              <div>
                {psychologist.description}
              </div>
            </div>
          </Row>
          <Row className={styles.psyInfo}>
            <Col n="md-6 sm-12">
              {fields.map(field => {
                const value = field.value ? psychologist[field.value] : field.custom(psychologist);
                return value ? (
                  <div key={field.name} className={styles.field} data-test-id="psy-info">
                    <div className={styles.fieldName}>
                      {field.name}
                    </div>
                    <div>
                      {value}
                    </div>
                  </div>
                ) : null;
              })}
            </Col>
            <Col
              n="md-6 sm-12"
              className={styles.mapContainer}
            >
              {psychologist.longitude && psychologist.latitude && (
              <MapContainer
                center={[psychologist.latitude, psychologist.longitude]}
                zoom={getZoomLevel()}
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
              )}
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
};

export default PublicPsychologistProfile;
