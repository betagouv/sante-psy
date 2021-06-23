import React, { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Notification from 'components/Notification/Notification';
import GlobalNotification from 'components/Notification/GlobalNotification';

import { useStore } from 'stores/';

import agent from 'services/agent';

const Login = () => {
  const {
    commonStore: { config, setNotification },
    userStore: { user, isTokenExpired, pullUser },
  } = useStore();
  const { token } = useParams();
  const history = useHistory();

  const [email, setEmail] = useState('');

  // todo :
  // remettre l'url precedente : /psychologue/login/<token> (au lieu du ?token=<token>)

  useEffect(() => {
    if (token) { // token recupéré dans les params
      // todo :
      //    - changer a lroute du loginController.login : POST /api/psychologue/login -> done.
      agent.User.login(token)
        .then(() => {
          pullUser();
          history.push('/psychologue/mes-seances');
        });
      //    - appeler User.getConnected() : ca appelle POST /api/psychologue/login et ca crée un cookie (on doit le voir dans les devtools) (agent.User.getConnected())
      //    - rappeler userStore.pullUser (pour refaire l'appel à /api/connecteduser)
      //    - history.push('/psychologue/mes-seances');

      /*
      setToken();
      agent.User.login(token)
        .then(loginInfo => {
          setToken(loginInfo.token);
          history.push('/psychologue/mes-seances');
        });
        */
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
    <div className="fr-container-fluid">
      <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div className="fr-col fr-col-xs-10 fr-col-md-8 fr-my-4w">
          <h1>
            Espace Psychologues
          </h1>

          <div className="panel margin-top-m">
            <h3>Me connecter</h3>
            {existingToken && isTokenExpired() && (
              <Notification
                message="Votre session a expiré, veuillez vous reconnecter."
                onClose={() => { setToken(null); }}
              />
            )}
            <GlobalNotification />
            <p className="fr-mb-2w">
              Vous recevrez un lien de connexion par email qui vous permettra d&lsquo;être connecté pendant
              {` ${config.sessionDuration} `}
              heures
            </p>
            <form onSubmit={login} id="login_form">
              <label>
                Adresse email :
                {' '}
                <input
                  data-test-id="email-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
              {' '}
              <button
                data-test-id="email-button"
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
            <p className="fr-mb-2w">
              Si vous avez besoin d&lsquo;aide, vous pouvez toujours envoyer un email à
              {' '}
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
