import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Button, Col, Row } from '@dataesr/react-dsfr';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import Page from 'components/Page/Page';

import agent from 'services/agent';
import camelize from 'services/string';
import styles from './publicPsychologistProfile.cssmodule.scss';

const fields = [
  { name: 'Adresse', value: 'address' },
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
          href={psychologist.website}
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
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    setError();
    agent.Psychologist.getProfile(psyId)
      .then(setPsychologist)
      .catch(() => {
        setError('Impossible de trouver les informations pour ce psychologue');
      });
  }, [psyId]);

  useEffect(() => {
    setCoordinates();
    if (psychologist) {
      agent.Map.findAddress(psychologist.address).then(response => {
        if (response.data.length > 0) {
          setCoordinates({
            lon: response.data[0].lon,
            lat: response.data[0].lat,
          });
        }
      });
    }
  }, [psychologist]);

  let title = 'Loading';
  if (error) {
    title = error;
  } else if (psychologist) {
    title = `${psychologist.lastName.toUpperCase()} ${camelize(psychologist.firstNames)}`;
  }
  return (
    <Page
      title={title}
      description={psychologist ? psychologist.description : ''}
      background="yellow"
      dataTestId="publicPsyProfilePage"
    >
      <Row justifyContent="right">
        <Button
          className="fr-mb-3w"
          secondary
          onClick={() => history.goBack()}
        >
          Revenir à l&lsquo;annuaire
        </Button>
      </Row>
      {psychologist && (
      <Row>
        <Col n="md-6 sm-12">
          {fields.map(field => (
            <div key={field.name} className={styles.field} data-test-id="psy-info">
              <div className={styles.fieldName}>
                {field.name}
              </div>
              <div>
                {field.value ? psychologist[field.value] : field.custom(psychologist)}
              </div>
            </div>
          ))}
        </Col>
        <Col
          n="md-6 sm-12"
          className={styles.mapContainer}
        >
          {coordinates && (
          <MapContainer
            center={[coordinates.lat, coordinates.lon]}
            zoom={13}
            scrollWheelZoom={false}
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordinates.lat, coordinates.lon]} />
          </MapContainer>
          )}
        </Col>
      </Row>
      )}
    </Page>
  );
};

export default PublicPsychologistProfile;
