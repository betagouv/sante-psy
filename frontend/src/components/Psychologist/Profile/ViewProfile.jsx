import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';

import GlobalNotification from 'components/Notification/GlobalNotification';
import SuspensionInfo from './SuspensionInfo';

const ViewProfile = ({ psychologist, loading, activatePsychologist }) => {
  const history = useHistory();
  return (
    <>
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
          <Button
            data-test-id="show-profile-form-button"
            icon="fr-fi-edit-line"
            title="Modify"
            onClick={() => history.push('/psychologue/mon-profil/modifier')}
          >
            Modifier mes informations
          </Button>
        </div>
        <SuspensionInfo
          psychologist={psychologist}
          activatePsychologist={activatePsychologist}
        />
      </div>
      )}
    </>
  );
};

export default ViewProfile;
