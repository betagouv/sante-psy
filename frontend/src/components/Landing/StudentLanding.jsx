import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { Button, TextInput } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import GlobalNotification from 'components/Notification/GlobalNotification';
import { useStore } from 'stores/';
import Statistics from './Statistics';

import landingStyles from './landing.cssmodule.scss';
import studentStyles from './studentProcess.cssmodule.scss';
import StudentCards from './StudentCards';

const StudentLanding = () => {
  const emailRef = useRef();
  const [email, setEmail] = useState('');
  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
    // Not set when redirecting
    if (emailRef.current) {
      emailRef.current.focus();
    }

    if (__PIXEL_ADS__) {
      fbq('track', 'PageView');
    }
  }, []);

  const trackEvent = () => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'SendMail']);
    }
    if (__PIXEL_ADS__) {
      fbq('track', 'Contact');
      gtag('event', 'conversion', { 'send_to': 'AW-10803675495/0jD3CLHYqYMDEOeCzJ8o' });
    }
  }

  const sendMail = e => {
    e.preventDefault();
    agent.User.sendStudentMail(email)
      .then(notification => setNotification(notification.data, true, false))
      .catch(error => {
        setNotification(error.response.data, false, false);
      });

    trackEvent();
  };

  return (
    <div className={classnames(landingStyles.container, 'fr-container')} data-test-id="landingPageContainer">
      <div className={landingStyles.sectionAlt}>
        <div className={studentStyles.container}>
          <h1 className={studentStyles.title}>
            <div>Étudiantes et étudiants,</div>
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
    </div>
  );
};

export default StudentLanding;
