import { Alert, Button, TextInput } from '@dataesr/react-dsfr';
import trackAds from 'services/trackAds';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import agent from 'services/agent';
import styles from './newsletter.cssmodule.scss';

const Newsletter = ({ emailRef, withTracking, withText }) => {
  const searchParams = useLocation().search;
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState();
  const [facebookConsent, setFacebookConsent] = useState(false);
  const [googleAdsConsent, setGoogleAdsConsent] = useState(false);

  const from = new URLSearchParams(searchParams).get('from');

  useEffect(() => {
    if (withTracking && __PIXEL_ADS__) {
      // Inspired by https://developers.axeptio.eu/cookies/cookies-integration
      trackAds.initAxeptio();

      if (!window._axcb) {
        window._axcb = [];
      }
      window._axcb.push(axeptio => {
        axeptio.on('cookies:complete', choices => {
          if (choices.facebook_pixel) {
            setFacebookConsent(true);
            trackAds.initFacebookAds();
          } else {
            setFacebookConsent(false);
            trackAds.removeFacebookAds();
          }
          if (choices.Google_Ads) {
            setGoogleAdsConsent(true);
            trackAds.initGoogleAds();
          } else {
            setGoogleAdsConsent(false);
            trackAds.removeGoogleAds();
          }
        });

        // See https:// developers.axeptio.eu/site-integration/special-cases-spa-or-react
        axeptio.on('consent:saved', () => {
          window.location.reload();
        });
      });
    }
  }, []);

  const onSubmit = event => {
    event.preventDefault();
    if (email) {
      trackEvent();
      agent.Student.sendMail(email, from)
        .then(response => {
          setNotification({ type: 'success', message: response.data.message });
        })
        .catch(e => {
          setNotification({ type: 'error', message: e.response.data });
        });
    }
  };

  const trackEvent = () => {
    if (!withTracking) {
      return;
    }

    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'SendMail']);
      if (from) {
        _paq.push(['trackEvent', from, 'SendMail']);
      }
    }

    if (facebookConsent) {
      trackAds.trackFacebookAds();
    }

    if (googleAdsConsent) {
      trackAds.trackGoogleAds();
    }
  };

  return (
    notification
      ? <Alert className={styles.alert} type={notification.type} title={notification.message} />
      : (
        <div className={styles.container}>
          {withText && <span>Vous souhaitez en savoir plus et être accompagné sur les premières étapes&nbsp;:</span>}
          <div className={styles.innercontainer}>
            <img src="/images/newsletter.svg" alt="Newsletter" className={styles.logo} />
            <div className={styles.separator} />
            <form
              className={styles.form}
              onSubmit={onSubmit}
            >
              <TextInput
                ref={emailRef}
                placeholder="Votre e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button
                submit
              >
                Suivez le guide
              </Button>
            </form>
          </div>
        </div>
      )
  );
};

export default Newsletter;
