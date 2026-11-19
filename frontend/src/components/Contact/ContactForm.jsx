import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { Select } from '@codegouvfr/react-dsfr/Select';
import { Button } from '@codegouvfr/react-dsfr/Button';
import Page from 'components/Page/Page';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';
import { useStore } from 'stores/';
import styles from './contactForm.cssmodule.scss';

const ContactForm = () => {
  const [userType, setUserType] = useState();
  const [name, setName] = useState();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();
  const [reason, setReason] = useState();
  const [message, setMessage] = useState();

  const {
    commonStore: { setNotification, config },
  } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.reason) {
      setReason(location.state.reason);
    }
  }, [location]);

  const submit = (e) => {
    e.preventDefault();
    agent.Contact.send({
      user: userType,
      name,
      firstName,
      email,
      reason,
      message,
      navigator: navigator.userAgent,
    })
      .then((response) => {
        setNotification(response, true, false);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setNotification(
            {
              message: (
                <p>
                  Une erreur est survenue, veuillez nous contacter par email à{' '}
                  <a href={`mailto:${config.contactEmail}`}>
                    {config.contactEmail}
                  </a>
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
      breadCrumbs={[
        { href: '/', label: 'Accueil' },
        { href: '/contact', label: 'Nous contacter' },
      ]}
      currentBreadCrumb="Formulaire de contact"
      title={
        <>
          Contacter <b>Santé Psy Étudiant</b>
        </>
      }
      description={
        <>
          Ma question ne figure pas dans la <Link to="/faq">FAQ</Link>, je peux
          contacter le support.
        </>
      }
      className="contactPage"
    >
      <GlobalNotification />
      <form onSubmit={submit}>
        <RadioButtons
          legend="Je suis"
          orientation="horizontal"
          options={[
            {
              label: 'Étudiant',
              value: 'étudiant',
              nativeInputProps: {
                'data-test-id': 'user-student-input',
                onChange: () => setUserType('étudiant'),
              },
            },
            {
              label: 'Psychologue',
              value: 'psychologue',
              nativeInputProps: {
                'data-test-id': 'user-psychologist-input',
                onChange: () => setUserType('psychologue'),
              },
            },
            {
              label: 'Autre',
              value: 'autre-utilisateur',
              nativeInputProps: {
                onChange: () => setUserType('autre-utilisateur'),
              },
            },
          ]}
        />
        <div className={styles.line}>
          <Input
            label="Nom"
            nativeInputProps={{
              required: true,
              value: name,
              'data-test-id': 'name-input',
              onChange: (e) => setName(e.target.value),
            }}
          />
          <Input
            label="Prenom"
            nativeInputProps={{
              required: true,
              value: firstName,
              'data-test-id': 'first-name-input',
              onChange: (e) => setFirstName(e.target.value),
            }}
          />
          <Input
            label="Email"
            nativeInputProps={{
              required: true,
              type: 'email',
              value: email,
              'data-test-id': 'email-input',
              onChange: (e) => setEmail(e.target.value),
            }}
          />
          <Select
            label="Sujet"
            nativeSelectProps={{
              required: true,
              value: reason,
              'data-test-id': 'reason-select',
              onChange: (e) => setReason(e.target.value),
            }}
          >
            <option value="" disabled hidden>
              - Sélectionner la raison de votre message -
            </option>
            <option value="éligibilité">Éligibilité</option>
            <option value="probleme-inscription">Problème d'inscription</option>
            <option value="espace-etudiant">Espace étudiant</option>
            <option value="convention">Convention</option>
            <option value="remboursement">Remboursement</option>
            <option value="rétractation">Rétractation</option>
            <option value="connexion">Problème de connexion</option>
            <option value="presse">Presse/communication</option>
            <option value="autre-raison">Autre</option>
          </Select>
          <Input
            label="Message"
            className={styles.fullWidthInput}
            hintText="Merci de ne fournir que les données personnelles strictement nécessaires au traitement de la demande."
            textArea
            nativeTextAreaProps={{
              required: true,
              rows: 5,
              value: message,
              'data-test-id': 'message-input',
              onChange: (e) => setMessage(e.target.value),
            }}
          />
        </div>
        <Button
          className="fr-mt-4w"
          data-test-id="submit-button"
          nativeButtonProps={{ type: 'submit' }}
        >
          Envoyer
        </Button>
      </form>
    </Page>
  );
};

export default observer(ContactForm);
