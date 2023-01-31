import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, TextInput, Row, Col } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';
import Section from 'components/Page/Section';

import { useStore } from 'stores/';

import agent from 'services/agent';
import styles from './login.cssmodule.scss';

const Login = () => {
  const {
    commonStore: { config, setNotification },
    userStore: { user, setXsrfToken },
  } = useStore();

  const emailRef = useRef();
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  useEffect(() => {
    // Not set when redirecting
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (token) {
      agent.User.login(token)
        .then(xsrfToken => {
          setXsrfToken(xsrfToken);
        });
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      navigate('/psychologue/mes-seances');
    }
  }, [user, token]);

  const login = e => {
    e.preventDefault();
    agent.User.sendMail(email).then(setNotification);
  };

  return (
    <Page
      title={(
        <>
          Espace
          {' '}
          <b>Psychologues</b>
        </>
)}
      background="blue"
    >
      <Section
        title="Me connecter"
      >
        <GlobalNotification />
        <p>
          Vous recevrez un lien de connexion par email qui vous permettra d&lsquo;être connecté pendant
          {` ${config.sessionDuration} `}
          heures
        </p>
        <form onSubmit={login} id="login_form">
          <Row alignItems="bottom">
            <Col>
              <label>
                Adresse email :
                <TextInput
                  ref={emailRef}
                  className={styles.mailInput}
                  data-test-id="email-input"
                  value={email}
                  type="email"
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
            </Col>
            <Col>
              <Button
                submit
                className={styles.loginButton}
                data-test-id="email-button"
              >
                Recevoir le lien de connexion
              </Button>
            </Col>
          </Row>
        </form>
      </Section>

      <Section
        title="⚠️&nbsp;Problème d&lsquo;accès ?"
      >
        <p>Pour rappel :</p>
        <ul>
          <li>
            Veuillez indiquer l&lsquo;email utilisé lors de votre inscription
            {' '}
            <a href={config.demarchesSimplifieesUrl} target="_blank" rel="noopener noreferrer">en ligne</a>
            . Il peut être différent de votre email de contact présenté dans l‘annuaire des psychologues.
          </li>
          <li>
            Si vous ne recevez pas l&lsquo;email de connexion, pensez à vérifier vos spams et ajouter l&lsquo;adresse
            {` "${config.contactEmail}" `}
            à votre carnet d&lsquo;adresse email.
          </li>
          <li>
            Si vous recevez l&lsquo;email de connexion mais le lien ne s&lsquo;ouvre pas, veuillez nous contacter.
          </li>
        </ul>
      </Section>
      <Mail />
    </Page>
  );
};

export default observer(Login);
