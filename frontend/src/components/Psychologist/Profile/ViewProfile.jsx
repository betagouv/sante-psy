import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';

import PayingUniversity from './PayingUniversity';
import SuspensionInfo from './SuspensionInfo';

const informations = [
  { label: 'Département', key: 'departement' },
  { label: 'Région', key: 'region' },
  { label: 'Adresse du cabinet', key: 'address' },
  { label: 'Téléphone du secrétariat', key: 'phone' },
  { label: 'Email de contact', key: 'email' },
  { label: 'Téléconsultation', key: psychologist => (psychologist.teleconsultation ? 'Oui' : 'Non') },
  { label: 'Langues parlées', key: 'languages' },
  { label: 'Site web professionnel', key: 'website' },
  { label: 'Paragraphe de présentation', key: 'description' },
];
const ViewProfile = ({ psychologist, loading, activatePsychologist }) => {
  const history = useHistory();
  return (
    <>
      <PayingUniversity />
      {!loading && (
        <>
          <div className="fr-my-3w">
            <h5>Informations pour l&lsquo;annuaire</h5>
            <Button
              className="fr-mb-1w"
              data-test-id="show-profile-form-button"
              title="Modify"
              icon="fr-fi-edit-line"
              onClick={() => history.push('/psychologue/mon-profil/modifier')}
            >
              Modifier mes informations
            </Button>
            {informations.map(info => (
              <p className="fr-mb-1v" key={info.label}>
                <b>{`${info.label} :`}</b>
                {` ${typeof info.key === 'string' ? psychologist[info.key] : info.key(psychologist)}`}
              </p>
            ))}
          </div>
          <div className="fr-mb-2w">
            <SuspensionInfo
              psychologist={psychologist}
              activatePsychologist={activatePsychologist}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ViewProfile;
