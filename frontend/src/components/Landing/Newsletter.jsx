import React, { useState } from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { useLocation } from 'react-router-dom';
import agent from 'services/agent';
import useConsentAds from 'src/utils/googleAds/useConsentAds';
import styles from './newsletter.cssmodule.scss';

const Newsletter = ({ emailRef, withTracking, withText }) => {
  const searchParams = useLocation().search;
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState();
  const from = new URLSearchParams(searchParams).get('from');

  const { trackFacebookAds, trackGoogleAdsNewsletter } =
    useConsentAds(withTracking);

  const onSubmit = (event) => {
    event.preventDefault();
    if (email) {
      trackEvent();
      agent.StudentNewsletter.sendStudentMail(email, from)
        .then((response) => {
          setNotification({ type: 'success', message: response.data.message });
        })
        .catch((e) => {
          setNotification({ type: 'error', message: e.response.data });
        });
    }
  };

  const trackEvent = () => {
    if (!withTracking) {
      return;
    }

    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'SendStudentMail']);
      if (from) {
        _paq.push(['trackEvent', from, 'SendStudentMail']);
      }
    }

    trackFacebookAds();
    trackGoogleAdsNewsletter();
  };

  return notification ? (
    <Alert
      className={styles.alert}
      severity={notification.type}
      title={notification.message}
      description=""
    />
  ) : (
    <div className={styles.container}>
      {withText && (
        <span>
          Vous souhaitez en savoir plus et être accompagné sur les premières
          étapes&nbsp;:
        </span>
      )}
      <div className={styles.innercontainer}>
        <img
          src="/images/icons/newsletter.svg"
          alt="Newsletter"
          className={styles.logo}
        />
        <div className={styles.separator} />
        <form className={styles.form} onSubmit={onSubmit}>
          <Input
            label="Email"
            nativeInputProps={{
              ref: emailRef,
              placeholder: 'Votre email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }}
          />
          <Button nativeButtonProps={{ type: 'submit' }}>
            Suivez le guide
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
