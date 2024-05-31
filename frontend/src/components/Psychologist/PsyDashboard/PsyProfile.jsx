import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import agent from 'services/agent';
import { useStore } from 'stores';

import { Button, Icon } from '@dataesr/react-dsfr';
import EditProfile from 'components/Psychologist/PsyDashboard/EditProfile';

import PsyCardInfo from './PsyCardInfo';
import styles from './psyDashboard.cssmodule.scss';

const PsyProfile = () => {
  const {
    commonStore: { setNotification, setPsychologists },
    userStore: { pullUser, user },
  } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [psychologist, setPsychologist] = useState();
  const [editMode, setEditMode] = useState(false);

  const greenCircleIcon = '/images/icon-available-psy.svg';
  const orangeCircleIcon = '/images/icon-unavailable-psy.svg';
  const redCircleIcon = '/images/icon-invisible-psy.svg';

  const formatDate = isoDate => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const getProfilIssues = psy => {
    const profilIssues = [];
    if (!psy.description || psy.description.length < 50) {
      profilIssues.push('Votre présentation est trop courte.');
    }

    const isWebsite = new RegExp(
      '^(https?:\\/\\/)?' // protocol
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
        + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
        + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        + '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    if (psy.website && !isWebsite.test(psy.website)) {
      profilIssues.push('Votre site internet ne semble pas valide.');
    }

    if (psy.appointmentLink && !isWebsite.test(psy.appointmentLink)) {
      profilIssues.push(
        'Votre site internet de prise de rendez-vous ne semble pas valide.',
      );
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
    agent.Psychologist.getProfile()
      .then(response => {
        const profilIssues = getProfilIssues(response);
        setPsychologist({ ...response, profilIssues });
        setLoading(false);
      })
      .catch(() => {
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
        updatePsyList();
        window.scrollTo(0, 0);
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const updatePsyList = () => {
    agent.Psychologist.find().then(setPsychologists);
  };

  const cancelEditProfile = () => {
    setEditMode(false);
    window.scrollTo(0, 0);
  };

  const handleEditMode = value => {
    setEditMode(value);
  };

  const renderPsychologistAvailability = () => {
    if (user.inactiveUntil && user.inactiveUntil.startsWith('9999')) {
      return (
        <span>
          <img src={redCircleIcon} alt="red circle" />
          <span className={styles.inactiveTexts}>
            <p>Invisible dans l&lsquo;annuaire</p>
            <p className={styles.inactiveSubtext}>
              Les étudiants ne peuvent plus vous voir dans l&apos;annuaire
            </p>
          </span>
        </span>
      );
    }
    if (user.inactiveUntil && !user.active) {
      return (
        <>
          <img src={orangeCircleIcon} alt="orange circle" />
          <span className={styles.inactiveTexts}>
            <p>
              <b>Indisponible</b>
              {' '}
              dans l&lsquo;annuaire
            </p>
            <p className={styles.inactiveSubtext}>
              Date de fin :
              {' '}
              {formatDate(user.inactiveUntil)}
            </p>
          </span>
        </>
      );
    }
    return (
      <span>
        <img src={greenCircleIcon} alt="green circle" />
        <p>Disponible dans l&lsquo;annuaire</p>
      </span>
    );
  };

  return (
    !loading && (
      editMode ? (
        <EditProfile
          psychologist={psychologist}
          updatePsy={updatePsy}
          cancelEditProfile={cancelEditProfile}
            />
      ) : (
        <div className={styles.psyDashboard}>
          <div className="fr-my-2w">
            <HashLink
              id="new-appointment-button"
              to="/psychologue/nouvelle-seance"
              className="fr-btn"
                >
              <div data-test-id="new-appointment-button">
                <Icon name="ri-add-line" />
                Déclarer une séance
              </div>
            </HashLink>
          </div>
          <PsyCardInfo
            psychologist={psychologist}
            onEditMode={handleEditMode}
              />
          <section className={styles.psyDashboardCard}>
            <Button
              id="show-convention-form"
              data-test-id="show-convention-form"
              secondary
              className={styles.psyDashboardConvention}
              onClick={() => navigate('/psychologue/ma-convention')}
              icon={
                    !user.convention.isConventionSigned ? 'ri-edit-line' : ''
                  }
              iconPosition="right"
              disabled={user.convention.isConventionSigned}
                >
              {user.convention && user.convention.isConventionSigned ? (
                <span>
                  <img src={greenCircleIcon} alt="green circle" />
                  <p>
                    Convention :&nbsp;
                    <b>Signée</b>
                  </p>
                </span>
              ) : (
                <span>
                  <img src={redCircleIcon} alt="red circle" />
                  <p>
                    Convention :&nbsp;
                    <b>Pas encore signée</b>
                  </p>
                </span>
              )}
            </Button>
            <Button
              secondary
              className={styles.psyDashboardAvailability}
              onClick={() => navigate('/psychologue/ma-disponibilite/')}
              icon="ri-edit-line"
              iconPosition="right"
              id="show-availability-form"
              data-test-id="show-availability-form"
                >
              {renderPsychologistAvailability()}
            </Button>
          </section>
          <section className={styles.psyDashboardDescription}>
            <b>Description : </b>
            <p>
              {psychologist.description}
            </p>
            <Button
              secondary
              title="Modify"
              icon="ri-edit-line"
              onClick={() => {
                setEditMode(true);
                document.getElementById('description-input').scrollIntoView({ behavior: 'smooth' });
              }}
              className={styles.buttonEdit}
                >
              Modifier
            </Button>
          </section>
        </div>
      )
    )
  );
};

export default PsyProfile;
