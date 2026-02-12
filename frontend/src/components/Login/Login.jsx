import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, TextInput, Row, Col } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import Mail from 'components/Footer/Mail';
import Section from 'components/Page/Section';

import { useStore } from 'stores/';

import agent from 'services/agent';
import GlobalNotification from 'components/Notification/GlobalNotification';
import styles from './login.cssmodule.scss';

const Login = () => {
  const {
    commonStore: { config, setNotification },
    userStore: { setXsrfToken, role, setRole, user, xsrfToken, pullUser },
  } = useStore();

  const emailRef = useRef();
  const loginCalled = useRef(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');

  useEffect(() => {
    // Not set when redirecting
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const isOnLoginPage = location.pathname === '/login' || location.pathname.startsWith('/login/');
    const isLoginWithToken = location.pathname.startsWith('/login/') && token;

    // Case 1: Login with token from email link (always login when token is in URL)
    if (isLoginWithToken && !loginCalled.current) {
      loginCalled.current = true;
      agent.Auth.login(token)
        .then(async data => {
          await setRole(data.role);
          await setXsrfToken(data.xsrfToken);
          // After login, load user then redirect
          return pullUser();
        })
        .then(() => {
          loginCalled.current = false;
        })
        .catch(error => {
          console.error('Login failed:', error.response?.data || error);
          setNotification({ message: error.response?.data?.message || 'Une erreur est survenue lors de la connexion.', type: 'error' }, false);
          loginCalled.current = false; // Allow retry
        });
      return;
    }

    // Case 2: Already connected with user loaded, on /login page -> redirect immediately
    if (isOnLoginPage && xsrfToken && role && user) {
      if (role === 'psy') {
        navigate('/psychologue/tableau-de-bord', { replace: true });
      } else if (role === 'student') {
        navigate('/etudiant/mes-seances', { replace: true });
      }
    }
  }, [token, xsrfToken, role, user, location.pathname]); // Minimal dependencies

  const loginUser = e => {
    e.preventDefault();
    agent.Auth.sendLoginMail(email).then(setNotification);
  };

  // If user already has valid session and on /login (not /login/TOKEN), don't render login form
  if (xsrfToken && role && user && !token) {
    return null;
  }

  return (
    <Page
      title={(
        <>
          Mon
          {' '}
          <b>Espace</b>
        </>
      )}
    >
      <Section
        title="Connexion"
      >

        <GlobalNotification />
        <form onSubmit={loginUser} id="login_form">
          <Row alignItems="bottom">
            <Col>
              <TextInput
                ref={emailRef}
                className={styles.mailInput}
                data-test-id="email-input"
                value={email}
                type="email"
                onChange={e => setEmail(e.target.value)}
              />
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
          <br />
          <p>Pas de mot de passe !</p>
          <p>
            Vous recevrez un lien de connexion par email qui vous permettra d&lsquo;être connecté pendant
            {` ${config.sessionDuration} `}
            heures
          </p>
        </form>
      </Section>

      <Section title="Un problème ?">
        <ul>
          <li>
            Indiquez l&lsquo;email utilisé lors de votre inscription
          </li>

          <li>
            Si vous ne recevez pas l&lsquo;email de connexion :
            <ul>
              <li>Vérifiez vos spams</li>
              <li>Attendez quelques minutes</li>
            </ul>
          </li>
        </ul>
      </Section>
      <Section
        title="Vous n&lsquo;avez pas encore créé votre espace ?"
      >
        <Row>
          <Col>
            <p>
              Étudiants, c&lsquo;est par ici pour s&lsquo;inscrire
            </p>
            <Button
              onClick={() => navigate('/inscription')}
              className={styles.loginButton}
            >
              Créer mon espace étudiant
            </Button>

          </Col>
          <Col>
            <p>
              Psychologues, créez votre dossier
            </p>
            <Button
              onClick={() => window.open('https://www.demarches-simplifiees.fr/', '_blank')}
              className={styles.loginButton}
            >
              Déposer un dossier psychologue
            </Button>
          </Col>
        </Row>
      </Section>
      <Mail />
    </Page>
  );
};

export default observer(Login);
