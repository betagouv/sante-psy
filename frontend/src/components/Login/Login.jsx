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
    userStore: { setXsrfToken, role, setRole, user },
  } = useStore();

  const emailRef = useRef();
  const loginCalled = useRef(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');

  useEffect(() => {
    const isOnLoginPage = location.pathname === '/login' || location.pathname.startsWith('/login/');

    if (isOnLoginPage && !token && user && role) {
      if (role === 'psy') {
        navigate('/psychologue/tableau-de-bord', { replace: true });
      } else if (role === 'student') {
        navigate('/etudiant/mes-seances', { replace: true });
      } else {
        console.warn('Unknown role, logging out:', role);
        navigate('/logout', { replace: true });
      }
    }
  }, [token, user, role, navigate, location]);

  useEffect(() => {
    // Not set when redirecting
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (token && !loginCalled.current) {
      loginCalled.current = true;
      agent.Auth.login(token)
        .then(async data => {
          setRole(data.role);
          await setXsrfToken(data.xsrfToken);
        }).catch(error => {
          setNotification({ message: error.response?.data.message || 'Une erreur est survenue lors de la connexion.', type: 'error' }, false);
        });
    }
  }, [token, setRole, setXsrfToken, setNotification]);

  useEffect(() => {
    if (!token || loginCalled.current === false) {
      return;
    }
    if (!role) {
      return;
    }
    if (role === 'psy') {
      navigate('/psychologue');
    }
    if (role === 'student') {
      navigate('/etudiant');
    }
  }, [role, token, navigate]);

  const loginUser = e => {
    e.preventDefault();
    agent.Auth.sendLoginMail(email).then(setNotification);
  };

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

      <Section
        title="Un problème ?"
      >
        <ul>
          <li>
            Indiquez l&lsquo;email utilisé lors de votre inscription
          </li>
          <li>
            <ul>
              Si vous ne recevez pas l&lsquo;email de connexion
              <li>
                Vérifiez vos spams
              </li>
              <li>
                Attendez quelques minutes
              </li>
            </ul>
          </li>
        </ul>
      </Section>
      <Section
        title="Pas d'espace ?"
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
