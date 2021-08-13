import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';

import EditProfile from 'components/Psychologist/Profile/EditProfile';

import agent from 'services/agent';

import { useStore } from 'stores';
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

const PsyProfile = () => {
  const viewProfilRef = useRef();

  const { commonStore: { setNotification }, userStore: { pullUser } } = useStore();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [psychologist, setPsychologist] = useState();
  const [editMode, setEditMode] = useState(false);
  const [suspensionMode, setSuspensionMode] = useState(false);

  const loadPsychologist = () => {
    pullUser();
    agent.Psychologist.getProfile().then(response => {
      setPsychologist(response);
      setLoading(false);
    }).catch(() => {
      history.goBack();
    });
  };

  useEffect(() => {
    loadPsychologist();
  }, []);

  const updatePsy = updatedPsychologist => {
    agent.Psychologist.updateProfile(updatedPsychologist)
      .then(response => {
        setEditMode(false);
        loadPsychologist();
        setNotification(response);
        viewProfilRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const suspendPsychologist = (reason, date) => {
    agent.Psychologist.suspend(reason, date)
      .then(response => {
        setSuspensionMode(false);
        loadPsychologist();
        setNotification(response);
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const activatePsychologist = () => {
    agent.Psychologist.activate()
      .then(response => {
        setSuspensionMode(false);
        loadPsychologist();
        setNotification(response);
      })
      .catch(() => window.scrollTo(0, 0));
  };

  return (
    <>
      <PayingUniversity />
      {!loading && (
      <>
        <div
          className="fr-my-3w"
          ref={viewProfilRef}
        >
          <h5>Informations pour l&lsquo;annuaire</h5>
          {editMode
            ? (
              <EditProfile
                psychologist={psychologist}
                updatePsy={updatePsy}
              />
            )
            : (
              <>
                <Button
                  className="fr-mb-1w"
                  data-test-id="show-profile-form-button"
                  title="Modify"
                  icon="fr-fi-edit-line"
                  onClick={() => setEditMode(true)}
                >
                  Modifier mes informations
                </Button>
                {informations.map(info => (
                  <p className="fr-mb-1v" key={info.label}>
                    <b>{`${info.label} :`}</b>
                    {` ${typeof info.key === 'string' ? psychologist[info.key] : info.key(psychologist)}`}
                  </p>
                ))}
              </>
            )}
        </div>
        <div className="fr-mb-2w">
          <SuspensionInfo
            suspensionMode={suspensionMode}
            setSuspensionMode={setSuspensionMode}
            psychologist={psychologist}
            activatePsychologist={activatePsychologist}
            suspendPsychologist={suspendPsychologist}
          />
        </div>
      </>
      )}
    </>
  );
};

export default PsyProfile;
