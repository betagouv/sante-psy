import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Badge, Button } from '@dataesr/react-dsfr';
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

  const otherInfo = psychologist && (
    <>
      <div className={styles.separator} />
      <h5>Langues parlées</h5>
      <div data-test-id="psy-info">
        {psychologist.languages}
      </div>
      {psychologist.longitude && psychologist.latitude && (
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
      )}
      <h5>{psychologist.otherAddress ? 'Adresses' : 'Adresse'}</h5>
      <div>
        <div data-test-id="psy-info">{psychologist.address}</div>
        <div data-test-id="psy-info">{psychologist.otherAddress}</div>
      </div>
    </>
  );
  return (
    <Page
      breadCrumbs={[
        { href: '/', label: 'Accueil' },
        { href: '/trouver-un-psychologue', label: 'Trouver un psychologue' },
      ]}
      currentBreadCrumb={psychologist && `${psychologist.firstNames} ${psychologist.lastName.toUpperCase()}`}
      title={<b>Psychologue</b>}
      description={psychologist && `${psychologist.firstNames} ${psychologist.lastName.toUpperCase()}`}
      dataTestId="publicPsyProfilePage"
    >
      {error && <Notification message={error} type="error" />}
      {psychologist && (
        <div className={styles.psyInfo}>
          <div className={styles.column}>
            <h3 className={styles.title} data-test-id="psy-info">Présentation</h3>
            <div>
              {psychologist.description}
            </div>
            {psychologist.teleconsultation && (
              <>
                <div className={styles.separator} />
                <h5>Consultation à distance</h5>
                <Badge
                  icon="ri-webcam-fill"
                  text="Téléconsultation disponible"
                  colorFamily="green-bourgeon"
                />
              </>
            )}
            <div className={styles.displayDesktop}>{otherInfo}</div>
          </div>
          <div className={styles.columnSeparator} />
          <div className={styles.column}>
            <h3>Contacter le psychologue</h3>
            <div className={styles.optionalSeparator} />
            {psychologist.phone && (
            <div className={styles.contactInfo}>
              <div>
                <h5>Téléphone</h5>
                {psychologist.phone}
              </div>
              <Button
                secondary
                onClick={() => { window.location.href = `tel:${psychologist.phone}`; }}
                icon="ri-phone-fill"
              />
            </div>
            )}
            {psychologist.email && (
            <div className={styles.contactInfo}>
              <div>
                <h5>E-mail</h5>
                {psychologist.email}
              </div>
              <Button
                secondary
                onClick={() => { window.location.href = `mailto:${psychologist.email}`; }}
                icon="ri-mail-fill"
              />
            </div>
            )}
            {psychologist.website && (
            <div className={styles.contactInfo}>
              <div>
                <h5>Site web</h5>
                <a
                  href={string.prefixUrl(psychologist.website)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {psychologist.website}
                </a>
              </div>
              <Button
                secondary
                onClick={() => { window.open(string.prefixUrl(psychologist.website), '_blank'); }}
                icon="ri-link"
              />
            </div>
            )}
            {psychologist.appointmentLink && (
              <div className={styles.contactInfo}>
                <div>
                  <h5>Prendre rendez-vous</h5>
                  <p>Directement en ligne</p>
                </div>
                {window.innerWidth <= 769 ? (
                  <Button
                    secondary
                    onClick={() => { window.open(string.prefixUrl(psychologist.appointmentLink), '_blank'); }}
                    icon="ri-calendar-fill"
                  >
                    RDV
                  </Button>
                ) : (
                  <Button
                    secondary
                    onClick={() => { window.open(string.prefixUrl(psychologist.appointmentLink), '_blank'); }}
                  >
                    Prendre rendez-vous
                  </Button>
                )}
              </div>
            )}
            <Alert
              type="warning"
              title="Vous n‘avez aucune avance de frais à prévoir"
              description="Le psychologue ne doit en aucun cas vous demander un complément financier ou une avance."
            />
            <div className={styles.displayMobile}>{otherInfo}</div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default PublicPsychologistProfile;
