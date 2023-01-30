import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Select, TextInput, RadioGroup, Radio } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';
import { useStore } from 'stores/';
import styles from './contact.cssmodule.scss';

const Contact = () => {
  const [userType, setUserType] = useState();
  const [name, setName] = useState();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();
  const [reason, setReason] = useState();
  const [message, setMessage] = useState();

  const { commonStore: { setNotification, config }, userStore: { user } } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.reason) {
      setReason(location.state.reason);
    }
  }, [location]);

  const defaultUserType = user ? 'psychologue' : undefined;

  const submit = e => {
    e.preventDefault();
    agent.Contact.send(
      { user: userType, name, firstName, email, reason, message, navigator: navigator.userAgent },
    )
      .then(response => {
        setNotification(response, true, false);
      })
      .catch(error => {
        if (error.response.status === 500) {
          setNotification(
            {
              message: (
                <p>
                  Une erreur est survenue, veuillez nous contacter par mail à
                  {' '}
                  <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
                </p>
              ),
            },
            false,
            false,
          );
        } else {
          // override agent client interceptor for this call
          // to allow it to be displayed outside psy pages
          setNotification(error.response.data, false, false);
        }
      })
      .finally(() => window.scrollTo(0, 0));
  };

  return (
    <Page
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      currentBreadCrumb="Nous contacter"
      title={(
        <>
          Contacter
          {' '}
          <b>Santé Psy Étudiant</b>
        </>
      )}
      description={(
        <>
          Ma question ne figure pas dans la
          {' '}
          <Link to="/faq">FAQ</Link>
          ,
          je peux contacter le support.
        </>
      )}
      className="contactPage"
    >
      <GlobalNotification />
      <form onSubmit={submit}>
        <RadioGroup
          legend="Je suis"
          isInline
          required
          value={defaultUserType}
          onChange={setUserType}
        >
          <Radio
            data-test-id="user-student-input"
            label="Étudiant"
            value="étudiant"
          />
          <Radio
            data-test-id="user-psychologist-input"
            label="Psychologue"
            value="psychologue"
          />
          <Radio
            label="Autre"
            value="autre-utilisateur"
          />
        </RadioGroup>
        <div className={styles.line}>
          <TextInput
            data-test-id="name-input"
            required
            label="Nom"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextInput
            data-test-id="first-name-input"
            required
            label="Prenom"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <TextInput
            data-test-id="email-input"
            required
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Select
            data-test-id="reason-select"
            required
            label="Motif"
            options={[
              { value: '', label: '- Selectionner la raison de votre message -', disabled: true, hidden: true },
              { value: 'éligibilité', label: 'Éligibilité' },
              { value: 'convention', label: 'Convention' },
              { value: 'remboursement', label: 'Remboursement' },
              { value: 'rétractation', label: 'Rétractation' },
              { value: 'connexion', label: 'Problème de connexion' },
              { value: 'presse', label: 'Presse/communication' },
              { value: 'autre-raison', label: 'Autre' },
            ]}
            selected={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
        <TextInput
          data-test-id="message-input"
          required
          textarea
          hint="Merci de ne fournir que les données personnelles strictement nécessaires au traitement de la demande. "
          label="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button
          data-test-id="submit-button"
          submit
        >
          Envoyer un message
        </Button>
      </form>
    </Page>
  );
};

export default observer(Contact);
