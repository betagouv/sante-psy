/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import classnames from 'classnames';
import { Button, TextInput } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import GlobalNotification from 'components/Notification/GlobalNotification';
import { useStore } from 'stores/';
import trackAds from 'services/trackAds';
import Statistics from './Statistics';

import landingStyles from './landing.cssmodule.scss';
import studentStyles from './studentProcess.cssmodule.scss';
import StudentCards from './StudentCards';
import FollowInstagram from './FollowInstagram';

const StudentLanding = () => {
  const [searchParams] = useSearchParams();
  const emailRef = useRef();
  const [email, setEmail] = useState('');
  const [facebookConsent, setFacebookConsent] = useState(false);
  const [googleAdsConsent, setGoogleAdsConsent] = useState(false);
  const [error, setError] = useState();
  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
    // Not set when redirecting
    if (emailRef.current) {
      emailRef.current.focus();
    }

    if (__PIXEL_ADS__) {
      // Inspired by https://developers.axeptio.eu/cookies/cookies-integration
      trackAds.initAxeptio();

      if (!window._axcb) {
        window._axcb = [];
      }
      window._axcb.push(axeptio => {
        axeptio.on('cookies:complete', choices => {
          if (choices.facebook_pixel) {
            console.debug('Consent given for facebook ads... launch script');
            setFacebookConsent(true);
            trackAds.initFacebookAds();
          } else {
            console.debug('Consent refused for facebook ads... remove script');
            setFacebookConsent(false);
            trackAds.removeFacebookAds();
          }
          if (choices.Google_Ads) {
            console.debug('Consent given for google ads... launch script');
            setGoogleAdsConsent(true);
            trackAds.initGoogleAds();
          } else {
            console.debug('Consent refused for google ads... remove script');
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

  const trackEvent = () => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'SendMail']);
      const from = searchParams.get('from');
      if (from) {
        console.debug(`Track contact event from ${from}`);
        _paq.push(['trackEvent', from, 'SendMail']);
      }
    }

    if (facebookConsent) {
      console.debug('Track contact event on facebook ads');
      trackAds.trackFacebookAds();
    }

    if (googleAdsConsent) {
      console.debug('Send conversion event to google ads');
      trackAds.trackGoogleAds();
    }
  };

  const sendMail = event => {
    event.preventDefault();
    if (email) {
      setError(null);
      agent.Student.sendMail(email)
        .then(notification => {
          setEmail('');
          setNotification(notification.data, true, false);
        })
        .catch(e => {
          setNotification(e.response.data, false, false);
        });
      trackEvent();
    } else {
      setError("L'email est obligatoire");
    }
  };

  return (
    <div className={classnames(landingStyles.container, 'fr-container')} data-test-id="landingPageContainer">
      <div className={landingStyles.sectionAlt}>
        <div className={studentStyles.container}>
          <h1 className={studentStyles.title}>
            <div>Étudiants,</div>
            <div>
              Bénéficiez de
              {' '}
              <span className={studentStyles.blueBackground}>8 séances gratuites</span>
              <div>
                avec un psychologue.
              </div>
            </div>
          </h1>
          <form onSubmit={sendMail} className={studentStyles.email}>
            <TextInput
              ref={emailRef}
              label="Votre email"
              placeholder="Votre email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              messageType={error ? 'error' : null}
            />
            <Button size="lg" submit>
              Recevoir plus d&lsquo;informations
            </Button>
            <GlobalNotification />
          </form>
          <StudentCards />
        </div>
      </div>
      <div className={landingStyles.section}>
        <Statistics />
      </div>
      <div className={landingStyles.sectionLight}>
        <FollowInstagram />
      </div>
    </div>
  );
};

export default StudentLanding;
