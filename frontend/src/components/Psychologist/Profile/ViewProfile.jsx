import React from 'react';
import { Link } from 'react-router-dom';

import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';

const ViewProfile = ({ psychologist, loading }) => (
  <div className="fr-container fr-mb-3w fr-mt-2w">
    <h1>Mes informations</h1>
    <GlobalNotification />
    {!loading && (
      <div className="fr-my-3w">
        <p data-test-id="personal-email-info">
          <b>Email personnel :</b>
          {' '}
          {psychologist.personalEmail}
        </p>
        <h2>Informations pour l&lsquo;annuaire</h2>
        <p className="fr-mb-1v">
          <b>Votre département :</b>
          {' '}
          {psychologist.departement}
        </p>
        <p className="fr-mb-1v">
          <b>Votre région :</b>
          {' '}
          {psychologist.region}
        </p>
        <p className="fr-mb-1v">
          <b>Adresse du cabinet :</b>
          {' '}
          {psychologist.address}
        </p>
        <p className="fr-mb-1v">
          <b>Téléphone du secrétariat :</b>
          {' '}
          {psychologist.phone}
        </p>
        <p className="fr-mb-1v">
          <b>Email de contact :</b>
          {' '}
          {psychologist.email}
        </p>
        <p className="fr-mb-1v">
          <b>Téléconsultation :</b>
          {' '}
          {psychologist.teleconsultation ? 'Oui' : 'Non'}
        </p>
        <p className="fr-mb-1v">
          <b>Langues parlées :</b>
          {' '}
          {psychologist.languages}
        </p>
        <p className="fr-mb-1v">
          <b>Site web professionnel :</b>
          {' '}
          {psychologist.website}
        </p>
        <p className="fr-mb-1v">
          <b>Paragraphe de présentation :</b>
          {' '}
          {psychologist.description}
        </p>
        <div className="fr-my-5w">
          <Link
            data-test-id="show-profile-form-button"
            to="/psychologue/mon-profil/modifier"
            className="fr-btn fr-btn--icon-left fr-fi-edit-line"
          >
            Modifier mes informations
          </Link>
        </div>
      </div>
    )}
    <Mail />
  </div>
);

export default ViewProfile;
