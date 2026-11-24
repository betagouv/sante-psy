import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agent from 'services/agent';
import { useStore } from 'stores';

import { Alert } from '@codegouvfr/react-dsfr/Alert';

import styles from './psyDashboard.cssmodule.scss';
import ConventionAvailabilitySection from './PsySection/ConventionAvailabilitySection';
import DescriptionSection from './PsySection/DescriptionSection';
import PsyCardInfo from './PsySection/PsyCardInfoSection';
import UnivContact from './UnivSection/Contact';
import BillingInfoDashboard from './UnivSection/BillingInfo';
import getPsyProfileIssues from '../../../utils/getPsyProfileIssues';
import Button from '@codegouvfr/react-dsfr/Button';

const PsyProfile = () => {
  const {
    userStore: { pullUser, user },
  } = useStore();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState({
    profilIssues: [],
    description: '',
  });
  const [university, setUniversity] = useState();

  const loadPsychologist = () => {
    pullUser();
    agent.Psychologist.getProfile()
      .then((response) => {
        const profileIssues = getPsyProfileIssues(response);
        setPsychologist({ ...response, profilIssues: profileIssues });
      })
      .catch(() => {
        navigate(-1);
      });
  };

  const loadUnivInfo = () => {
    const universityId = user?.convention?.universityId;
    if (!universityId) return;

    agent.University.getOne(universityId)
      .then((response) => {
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
          severity="info"
          title="Votre profil est incomplet"
          description={
            <>
              Cela n&lsquo;est pas bloquant mais pourrait empêcher les étudiants
              et étudiantes de vous contacter ou d&lsquo;identifier si vous
              répondez à leurs attentes.
              <ul>
                {psychologist.profilIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </>
          }
        />
      )}
      <div className="fr-my-2w">
        <Button
          id="new-appointment-button"
          linkProps={{
            to: '/psychologue/nouvelle-seance',
          }}
          data-test-id="new-appointment-button"
          iconId="fr-icon-add-line"
        >
          Déclarer une séance
        </Button>
      </div>
      <div className={styles.allSections}>
        <div className={styles.leftSection}>
          <PsyCardInfo psychologist={psychologist} user={user} />
          <ConventionAvailabilitySection
            psychologist={psychologist}
            user={user}
          />
          <DescriptionSection psychologist={psychologist} />
        </div>
        <div className={styles.rightSection}>
          <UnivContact university={university} />
          <BillingInfoDashboard />
        </div>
      </div>
    </div>
  );
};

export default PsyProfile;
