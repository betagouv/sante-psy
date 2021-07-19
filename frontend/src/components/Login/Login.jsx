import React, { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, TextInput, Row, Col } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';

import { useStore } from 'stores/';

import agent from 'services/agent';

const Login = () => {
  const {
    commonStore: { config, setNotification },
    userStore: { user, setXsrfToken },
  } = useStore();
  const { token } = useParams();
  const history = useHistory();

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token) {
      agent.User.login(token)
        .then(xsrfToken => {
          setXsrfToken(xsrfToken).then(() => {
            history.push('/psychologue/mes-seances');
          });
        });
    }
  }, [token]);

  const login = e => {
    e.preventDefault();
    agent.User.sendMail(email).then(setNotification);
  };

  if (user && !token) {
    return <Redirect to="/psychologue/mes-seances" />;
  }

  return (
    <Page
      title="Espace Psychologues"
      background="blue"
    >
      <h3>Me connecter</h3>
      <GlobalNotification />
      <p className="fr-mb-2w">
        Vous recevrez un lien de connexion par email qui vous permettra d&lsquo;être connecté pendant
        {` ${config.sessionDuration} `}
        heures
      </p>
      <form onSubmit={login} id="login_form">
        <Row alignItems="bottom">
          <Col className="fr-col-12 fr-col-sm-6">
            <TextInput
              label="Adresse email :"
              data-test-id="email-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Col>
          <Col className="fr-col-12 fr-col-sm-6">
            <Button
              submit
              data-test-id="email-button"
            >
              Recevoir le lien de connexion
            </Button>
          </Col>
        </Row>
      </form>

      <div className="panel border-left-primary">
        <h3>⚠️&nbsp;Problème d&lsquo;accès ?</h3>
        <p className="fr-mb-2w">
          Etes-vous bien enregistré via
          {' '}
          <a href={config.demarchesSimplifieesUrl} target="_blank" rel="noopener noreferrer">le formulaire d&lsquo;inscription</a>
          {' '}
          ?
          Il se peut que votre compte ne soit pas encore validé.
        </p>
        <p className="fr-mb-2w">
          L&lsquo;email à utiliser ici est le même que celui avec lequel vous avez fait votre candidature
          pour participer au dispositif.
          Il peut être différent de votre email de contact présenté dans l&lsquo;annuaire des psychologues.
        </p>
        <Mail />
      </div>
    </Page>
  );
};

export default observer(Login);
