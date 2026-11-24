import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import InstagramBanner from 'components/InstagramBanner/InstagramBanner';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import ServicesList from 'components/OtherServices/ServicesList';
import styles from './eligibilityMessage.cssmodule.scss';
import getMessage from './getMessageContents';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const EligibilityMessage = ({ isEligible, lastAnswerValue, whoFor }) => {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    function handleResize() {
      setSmall(window.innerWidth < 769);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Alert
        className={styles.alert}
        severity={isEligible ? 'success' : 'warning'}
        description={getMessage(isEligible, lastAnswerValue, whoFor)}
        title=""
      />

      <div style={{ marginTop: '20px' }}>
        <ButtonsGroup
          inlineLayoutWhen="md and up"
          buttons={[
            {
              iconId: 'fr-icon-arrow-left-line',
              iconPosition: 'left',
              size: 'small',
              priority: 'secondary',
              linkProps: { to: '/' },
              children: "Retour à l'accueil",
            },
            {
              iconId: 'fr-icon-arrow-go-back-line',
              iconPosition: 'left',
              size: 'small',
              priority: 'secondary',
              nativeButtonProps: {
                onClick: () => window.location.reload(),
              },
              children: 'Refaire le test',
            },
          ]}
        />
      </div>
      {isEligible ? (
        <>
          <div className={styles.conditionsContainer}>
            <h2>Rappel des conditions</h2>
            <ul>
              <li>Avoir un numéro INE,</li>
              <li>
                12 séances par année universitaire (du 1er septembre au 31
                août),
              </li>
              <li>
                Les étudiants peuvent changer de psychologue à tout moment.
              </li>
              <li>
                <b>Attention</b> : les séances sont{' '}
                <b>gratuites et sans avance de frais</b>, le psychologue ne doit
                pas demander de paiement.
              </li>
            </ul>
          </div>
          <InstagramBanner />
        </>
      ) : (
        <div className={styles.otherServicesContainer}>
          <h2>Autres services</h2>
          <ServicesList small={small} />
        </div>
      )}
    </div>
  );
};

export default observer(EligibilityMessage);
