import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import InstagramBanner from 'components/InstagramBanner/InstagramBanner';
import { Alert, Button } from '@dataesr/react-dsfr';
import ServicesList from 'components/OtherServices/ServicesList';
import { useNavigate } from 'react-router-dom';
import styles from './eligibilityMessage.cssmodule.scss';
import getMessage from './getMessageContents';

const EligibilityMessage = ({ isEligible, lastAnswerValue, whoFor }) => {
  const [small, setSmall] = useState(false);
  const navigate = useNavigate();

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
        type={isEligible ? 'success' : 'warning'}
        description={getMessage(isEligible, lastAnswerValue, whoFor)}
      />

      <div style={{ marginTop: '20px' }}>
        <Button
          onClick={() => navigate('/')}
          icon="fr-icon-arrow-left-line"
          iconPosition="left"
          size="sm"
          secondary
          className={styles.endFormButtons}
        >
          Retour à l&apos;accueil
        </Button>
        <Button
          onClick={() => window.location.reload()}
          icon="fr-icon-arrow-go-back-line"
          iconPosition="left"
          size="sm"
          secondary
          className={styles.endFormButtons}
        >
          Refaire le test
        </Button>
      </div>
      {isEligible ? (
        <>
          <div className={styles.conditionsContainer}>
            <h2>Rappel des conditions</h2>
            <ul>
              <li>
                Avoir un numéro INE,
              </li>
              <li>
                12 séances par année universitaire (du 1er septembre au 31
                août),
              </li>
              <li>
                Les étudiants peuvent changer de psychologue à tout moment.
              </li>
              <li>
                <b>Attention</b>
                {' '}
                : les séances sont
                {' '}
                <b>gratuites et sans avance de frais</b>
                , le psychologue ne doit
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
