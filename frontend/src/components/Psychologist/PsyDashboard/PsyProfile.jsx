import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import agent from 'services/agent';
import { useStore } from 'stores';

import { Alert, Button, Icon } from '@dataesr/react-dsfr';

import { formatStringToDDMMYYYY } from 'services/date';
import PsyCardInfo from './PsyCardInfo';
import styles from './psyDashboard.cssmodule.scss';

const PsyProfile = () => {
  const { userStore: { pullUser, user } } = useStore();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState({ profilIssues: [], description: '' });

  const greenCircleIcon = '/images/icon-available-psy.svg';
  const orangeCircleIcon = '/images/icon-unavailable-psy.svg';
  const redCircleIcon = '/images/icon-invisible-psy.svg';

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
      })
      .catch(() => {
        navigate(-1);
      });
  };

  useEffect(() => {
    loadPsychologist();
  }, []);

  const renderPsychologistAvailability = () => {
    if (user.inactiveUntil && user.inactiveUntil.startsWith('9999')) {
      return (
        <span>
          <img src={redCircleIcon} alt="red circle" />
          <span className={styles.inactiveTexts}>
            <p>Invisible dans l&apos;annuaire</p>
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
              dans l&apos;annuaire
            </p>
            <p className={styles.inactiveSubtext}>
              Date de fin :
              {' '}
              {formatStringToDDMMYYYY(user.inactiveUntil)}
            </p>
          </span>
        </>
      );
    }
    return (
      <span>
        <img src={greenCircleIcon} alt="green circle" />
        <p>
          <b>Disponible</b>
          {' '}
          dans l&apos;annuaire
        </p>
      </span>
    );
  };

  return (
    <div className={styles.psyDashboard} data-test-id="dashboard">
      {psychologist.profilIssues.length > 0 && (
        <Alert
          data-test-id="incomplete-profile-alert"
          className="fr-mb-2w"
          type="info"
          title="Votre profil est incomplet"
          description={(
            <>
              Cela n&lsquo;est pas bloquant mais pourrait empêcher les
              étudiants et étudiantes de vous contacter ou d&lsquo;identifier
              si vous repondez à leurs attentes.
              <ul>
                {psychologist.profilIssues.map(issue => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </>
          )}
        />
      )}
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
      <PsyCardInfo psychologist={psychologist} />
      <section className={styles.psyDashboardCard}>
        <Button
          id="show-convention-form"
          data-test-id="show-convention-form"
          secondary
          className={styles.psyDashboardConvention}
          onClick={() => navigate('/psychologue/ma-convention')}
          icon={!user.convention.isConventionSigned ? 'ri-edit-line' : ''}
          iconPosition="right"
        >
          {user.convention && user.convention.isConventionSigned ? (
            <span>
              <img src={greenCircleIcon} alt="green circle" />
              <p>
                Convention :
                <b> Signée</b>
              </p>
            </span>
          ) : (
            <span>
              <img src={redCircleIcon} alt="red circle" />
              <p>
                Convention :
                <b> Pas encore signée</b>
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
        <p>{psychologist.description}</p>
        <Button
          secondary
          title="Modify"
          icon="ri-edit-line"
          onClick={() => navigate('/psychologue/modifier-profil', { state: { psychologist } })}
          className={styles.buttonEdit}
        >
          Modifier
        </Button>
      </section>
    </div>
  );
};

export default PsyProfile;
