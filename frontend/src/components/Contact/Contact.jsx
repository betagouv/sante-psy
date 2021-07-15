import React, { useState } from 'react';
import { Button, Select, TextInput, RadioGroup, Radio } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';
import { useStore } from 'stores/';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const { commonStore: { setNotification, config } } = useStore();

  const submit = e => {
    e.preventDefault();
    agent.Contact.send({ user, name, firstName, email, reason, message })
      .then(response => {
        setNotification(response);
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
          );
        }
      })
      .finally(() => window.scrollTo(0, 0));
  };

  return (
    <Page
      title="Nous contacter"
      description={(
        <>
          Ma question ne figure pas dans la
          {' '}
          <Link to="/faq">FAQ</Link>
          ,
          je peux contacter le support.
        </>
      )}
      background="blue"
      className="contactPage"
    >
      <GlobalNotification />
      <form onSubmit={submit}>
        <RadioGroup
          legend="Je suis"
          isInline
          required
          onChange={setUser}
        >
          <Radio
            data-test-id="user-student-input"
            label="Étudiant"
            value="étudiant"
          />
          <Radio
            label="Psychologue"
            value="psychologue"
          />
          <Radio
            label="Autre"
            value="autre"
          />
        </RadioGroup>
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
          messageType=""
          label="Motif"
          options={[
            { value: '', label: '- Selectionner la raison de votre message -', disabled: true, hidden: true },
            { value: 'éligibilité', label: 'Éligibilité' },
            { value: 'convention', label: 'Convention' },
            { value: 'remboursement', label: 'Remboursement' },
            { value: 'rétractation', label: 'Rétractation' },
            { value: 'connexion', label: 'Problème de connexion' },
            { value: 'presse', label: 'Presse/communication' },
            { value: 'autre', label: 'Autre' },
          ]}
          selected={reason}
          onChange={e => setReason(e.target.value)}
        />
        <TextInput
          data-test-id="message-input"
          required
          textarea
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

export default Contact;
