import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Button, Col, Row } from '@dataesr/react-dsfr';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import Page from 'components/Page/Page';
import Notification from 'components/Notification/Notification';

import agent from 'services/agent';
import string from 'services/string';
import styles from './publicPsychologistProfile.cssmodule.scss';

const fields = [
  { name: 'Adresse', value: 'address' },
  { name: 'Deuxième adresse', value: 'otherAddress' },
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
        : <></>
    ),
  },
];

const PublicPsychologistProfile = () => {
  const history = useHistory();
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
      title="Profil psychologue"
      description="J'accède aux informations me permettant d'en apprendre plus sur un psychologue et de le contacter."
      background="yellow"
      dataTestId="publicPsyProfilePage"
    >
      <Row justifyContent="right">
        <Button
          className="fr-mb-3w"
          secondary
          onClick={() => history.goBack()}
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
                ) : <></>;
              })}
            </Col>
            <Col
              n="md-6 sm-12"
              className={styles.mapContainer}
            >
              {psychologist.longitude && psychologist.latitude && (
              <MapContainer
                center={[psychologist.latitude, psychologist.longitude]}
                zoom={psychologist.otherLongitude && psychologist.otherLatitude ? 5 : 13}
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
