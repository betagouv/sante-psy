import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Col, Row } from '@dataesr/react-dsfr';
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
  { name: 'Services de santé universitaire', value: 'address' },
  {
    name: 'Site web',
    custom: psychologist => (
      <a
        href={psychologist.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        {psychologist.website}
      </a>
    ),
  },
];

const PublicPsychologistProfile = () => {
  const { psyId } = useParams();
  const [psychologist, setPsychologist] = useState();
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    agent.Psychologist.getProfile(psyId).then(response => setPsychologist(response.psychologist));
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

  return (
    <Page
      title={psychologist ? `${psychologist.lastName.toUpperCase()} ${camelize(psychologist.firstNames)}` : 'Loading'}
      description={psychologist ? psychologist.description : ''}
      background="yellow"
      dataTestId="publicPsyProfilePage"
    >
      {psychologist && (
      <Row>
        <Col>
          {fields.map(field => (
            <div key={field.name} className={styles.field}>
              <div className={styles.fieldName}>
                {field.name}
              </div>
              <div>
                {field.value ? psychologist[field.value] : field.custom(psychologist)}
              </div>
            </div>
          ))}
        </Col>
        <Col>
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
