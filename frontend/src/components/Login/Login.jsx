import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Notification from 'components/Notification/Notification';

import useStore from 'stores/';

import agent from 'services/agent';

const Login = () => {
  const { commonStore: { config }, userStore: { setToken } } = useStore();
  const { token } = useParams();

  const [email, setEmail] = useState('');
  const [result, setResult] = useState({});

  useEffect(() => {
    if (token) {
      agent.Psychologist.login(token).then(loginInfo => {
        if (loginInfo.token) {
          setToken(loginInfo.token);
        } else {
          setResult(loginInfo);
        }
      });
    }
  }, [token]);

  const login = e => {
    e.preventDefault();
    agent.Psychologist.sendMail(email).then(setResult);
  };

  return (
    <div className="fr-container-fluid">
      <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div className="fr-col fr-col-xs-10 fr-col-md-8 fr-my-4w">
          <h1>
            Espace Psychologues
          </h1>

          <div className="panel margin-top-m">
            <h3>Me connecter</h3>
            {result.message && <Notification message={result.message} error={!result.success} />}
            <p className="fr-mb-2w">
              Vous recevrez un lien de connexion par email qui vous permettra d&lsquo;être connecté pendant
              {config.sessionDuration}
              heures
            </p>
            <form onSubmit={login} id="login_form">
              <label>
                Adresse email :
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
              <button
                type="submit"
                className="fr-btn"
                id="primary_email_button"
              >
                Recevoir le lien de connexion
              </button>
            </form>
          </div>

          <div className="panel border-left-primary">
            <h3>⚠️&nbsp;Problème d&lsquo;accès ?</h3>
            <p className="fr-mb-2w">
              Etes-vous bien enregistré via
              {' '}
              <a href="<%= formUrl %>" target="_blank" rel="noopener noreferrer">le formulaire d&lsquo;inscription</a>
              {' '}
              ?
              Il se peut que votre compte ne soit pas encore validé.
            </p>
            <p className="fr-mb-2w">
              L&lsquo;email à utiliser ici est le même que celui avec lequel vous avez fait votre candidature
              pour participer au dispositif.
              Il peut être différent de votre email de contact présenté dans l&lsquo;annuaire des psychologues.
            </p>
            <p className="fr-mb-2w">
              Si vous avez besoin d&lsquo;aide, vous pouvez toujours envoyer un email à
              <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Login);
