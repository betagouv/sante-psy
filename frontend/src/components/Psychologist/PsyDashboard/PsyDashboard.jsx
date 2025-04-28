import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import agent from 'services/agent';
import { useStore } from 'stores';

import { Alert, Icon } from '@dataesr/react-dsfr';

import styles from './psyDashboard.cssmodule.scss';
import ConventionAvailabilitySection from './PsySection/ConventionAvailabilitySection';
import DescriptionSection from './PsySection/DescriptionSection';
import PsyCardInfo from './PsySection/PsyCardInfoSection';
import UnivContact from './UnivSection/Contact';

// TODO version mobile à refaire

const PsyProfile = () => {
  const { userStore: { pullUser, user } } = useStore();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState({ profilIssues: [], description: '' });
  const [university, setUniversity] = useState();

  const getProfilIssues = psy => {
    const profilIssues = [];
    if (!psy.description || psy.description.length < 50) {
      profilIssues.push('Votre présentation est trop courte.');
    }

    const isWebsite = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
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

  const loadUnivInfo = () => {
    agent.University.getOne(user.convention.universityId)
      .then(response => {
        setUniversity({ ...response });
      })
      .catch(() => {
        navigate(-1);
      });
  };

  useEffect(() => {
    loadPsychologist();
    loadUnivInfo();
  }, []);

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
      <div className={styles.inlineCards}>
        <PsyCardInfo psychologist={psychologist} user={user} />
        <UnivContact university={university} />
      </div>
      <div>
        <span>
          <ConventionAvailabilitySection psychologist={psychologist} user={user} />
          <DescriptionSection psychologist={psychologist} />
        </span>
      </div>
    </div>
  );
};

export default PsyProfile;
