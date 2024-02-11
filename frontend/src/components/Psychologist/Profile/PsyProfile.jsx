import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, ButtonGroup } from '@dataesr/react-dsfr';

import EditProfile from 'components/Psychologist/Profile/EditProfile';

import agent from 'services/agent';

import { useStore } from 'stores';
import PayingUniversity from './PayingUniversity';
import SuspensionInfo from './SuspensionInfo';

const informations = [
  { label: 'Département', key: 'departement' },
  { label: 'Région', key: 'region' },
  { label: 'Adresse du cabinet', key: 'address' },
  { label: 'Autre adresse du cabinet', key: 'otherAddress' },
  { label: 'Téléphone du secrétariat', key: 'phone' },
  { label: 'Email de contact', key: 'email' },
  { label: 'Téléconsultation', key: psychologist => (psychologist.teleconsultation ? 'Oui' : 'Non') },
  { label: 'Langues parlées', key: 'languages' },
  { label: 'Site web professionnel', key: 'website' },
  { label: 'Paragraphe de présentation', key: 'description' },
];

const PsyProfile = () => {
  const viewProfilRef = useRef();
  const suspensionInfoRef = useRef();
  const { commonStore: { setNotification, setPsychologists }, userStore: { pullUser, user } } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [psychologist, setPsychologist] = useState();
  const [editMode, setEditMode] = useState(false);
  const [suspensionMode, setSuspensionMode] = useState(false);

  const getProfilIssues = psy => {
    const profilIssues = [];
    if (!psy.description || psy.description.length < 50) {
      profilIssues.push('Votre présentation est trop courte.');
    }

    const isWebsite = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (psy.website && !isWebsite.test(psy.website)) {
      profilIssues.push('Votre site internet ne semble pas valide.');
    }

    if (psy.address && (!psy.longitude || !psy.latitude)) {
      profilIssues.push(`L'adresse ${psy.address} ne semble pas valide.`);
    }

    if (psy.otherAddress && (!psy.otherLongitude || !psy.otherLatitude)) {
      profilIssues.push(`L'adresse ${psy.otherAddress} ne semble pas valide.`);
    }

    return profilIssues;
  };

  const loadPsychologist = () => {
    pullUser();
    agent.Psychologist.getProfile().then(response => {
      const profilIssues = getProfilIssues(response);
      setPsychologist({ ...response, profilIssues });
      setLoading(false);
    }).catch(() => {
      navigate(-1);
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
        updatePsyList();
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const updatePsyList = () => {
    agent.Psychologist.find().then(setPsychologists);
  };

  const cancelEditProfile = () => {
    setEditMode(false);
    viewProfilRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const suspendPsychologist = (reason, date) => {
    agent.Psychologist.suspend(reason, date)
      .then(response => {
        setSuspensionMode(false);
        loadPsychologist();
        setNotification(response);
        updatePsyList();
        suspensionInfoRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const activatePsychologist = () => {
    agent.Psychologist.activate()
      .then(response => {
        setSuspensionMode(false);
        loadPsychologist();
        setNotification(response);
        updatePsyList();
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const cancelSuspension = () => {
    setSuspensionMode(false);
    suspensionInfoRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
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
          <h3>Informations pour l&lsquo;annuaire</h3>
          {editMode
            ? (
              <EditProfile
                psychologist={psychologist}
                updatePsy={updatePsy}
                cancelEditProfile={cancelEditProfile}
              />
            )
            : (
              <>
                {psychologist.profilIssues.length > 0 && (
                  <Alert
                    data-test-id="incomplete-profile-alert"
                    className="fr-mb-2w"
                    type="info"
                    title="Votre profil est incomplet"
                    description={(
                      <>
                        Cela n&lsquo;est pas bloquant mais pourrait empêcher les étudiants et étudiantes
                        de vous contacter ou d&lsquo;identifier si vous repondez à leurs attentes.
                        <ul>
                          {psychologist.profilIssues.map(issue => <li key={issue}>{issue}</li>)}
                        </ul>
                      </>
                  )}
                  />
                )}
                <ButtonGroup
                  isInlineFrom="xs"
                  className="fr-mb-1w"
                >
                  <Button
                    id="show-profile-form-button"
                    data-test-id="show-profile-form-button"
                    title="Modify"
                    icon="ri-edit-line"
                    onClick={() => setEditMode(true)}
                  >
                    Modifier mes informations
                  </Button>
                  {psychologist.active && (
                    <Button
                      id="show-public-profile-button"
                      data-test-id="show-public-profile-button"
                      title="profil public"
                      icon="fr-fi-arrow-right-line"
                      secondary
                      onClick={() => navigate(`/trouver-un-psychologue/${user.dossierNumber}`)}
                    >
                      Voir mon profil public
                    </Button>
                  )}
                </ButtonGroup>
                {informations.map(info => {
                  const value = typeof info.key === 'string' ? psychologist[info.key] : info.key(psychologist);
                  return (
                    <div key={info.label}>
                      {value ? (
                        <p className="fr-mb-1v">
                          <b>{`${info.label} : `}</b>
                          {value}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </>
            )}
        </div>
        <div
          className="fr-mb-2w"
          ref={suspensionInfoRef}
        >
          <SuspensionInfo
            suspensionMode={suspensionMode}
            setSuspensionMode={setSuspensionMode}
            psychologist={psychologist}
            activatePsychologist={activatePsychologist}
            suspendPsychologist={suspendPsychologist}
            cancelSuspension={cancelSuspension}
          />
        </div>
      </>
      )}
    </>
  );
};

export default PsyProfile;
