import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import InstagramBanner from 'components/InstagramBanner/InstagramBanner';
import { Alert, Button } from '@dataesr/react-dsfr';
import ServicesList from 'components/OtherServices/ServicesList';
import { useNavigate } from 'react-router-dom';
import useConsentAds from 'src/utils/googleAds/useConsentAds';
import styles from './eligibilityMessage.cssmodule.scss';

const EligibilityMessage = ({ isEligible }) => {
  const [small, setSmall] = useState(false);
  const navigate = useNavigate();
  const { trackGoogleAdsEligibility } = useConsentAds(true, true);

  useEffect(() => {
    function handleResize() {
      setSmall(window.innerWidth < 769);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleButtonClick = () => {
    trackGoogleAdsEligibility();
    navigate('/trouver-un-psychologue');
  };

  return (
    <div>
      {isEligible ? (
        <Alert
          className={styles.alert}
          type="success"
          description={(
            <>
              <b>Vous êtes éligible au dispositif Santé Psy Étudiant !</b>
              <br />
              Prenez rendez-vous dès à présent avec un psychologue partenaire :
              <br />
              <Button
                onClick={handleButtonClick}
                icon="fr-icon-arrow-right-s-line"
                iconPosition="right"
                size="sm"
                className="fr-my-1w"
              >
                Prendre RDV
              </Button>
              <br />
              Votre certificat de scolarité vous sera demandé lors de votre
              première consultation.
            </>
          )}
        />
      ) : (
        <Alert
          className={styles.alert}
          type="warning"
          description={(
            <>
              <b>
                Nous sommes désolé, vous n’êtes hélas pas éligible au dispositif
                Santé Psy Étudiant.
              </b>
              <br />
              <br />
              Si vous avez un service étudiant, n’hésitez pas à vous en rapprocher pour
              confirmer que vous n’avez ni un numéro INE ni une cotisation CVEC.
              <br />
              <br />
              Auquel cas, retrouvez les différents services qui pourront vous
              accompagner ci-dessous.
            </>
          )}
        />
      )}

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
              <li>12 séances par année universitaire (du 1er septembre au 31 août),</li>
              <li>Les étudiants peuvent changer de psychologue à tout moment.</li>
              <li>
                <b>Attention</b>
                {' '}
                : les séances sont
                {' '}
                <b>gratuites et sans avance de frais</b>
                , le psychologue ne doit pas demander de paiement.
              </li>
            </ul>
          </div>
          <InstagramBanner />
        </>
      )
        : (
          <div className={styles.otherServicesContainer}>
            <h2>Autres services</h2>
            <ServicesList small={small} />
          </div>
        ) }
    </div>
  );
};

export default observer(EligibilityMessage);
