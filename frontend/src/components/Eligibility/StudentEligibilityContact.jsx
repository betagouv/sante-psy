import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Select, TextInput, RadioGroup, Radio, Icon } from '@dataesr/react-dsfr';
import Page from 'components/Page/Page';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';
import { useStore } from 'stores/';
import styles from './studentEligibility.cssmodule.scss';
import classNames from 'classnames';
import eligibility from 'services/faq/psychologue/eligibility';

const StudentEligibilityContact = () => {
  const [INE, setINE] = useState('');
  const [formation, setFormation] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [email, setEmail] = useState('');

  const { commonStore: { setNotification } } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.ine) {
      setINE(location.state.ine);
    }
  }, [location]);

  const submit = e => {
    e.preventDefault();
    agent.Eligibility.send(
      { email, formation, establishment, ine: INE },
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
      currentBreadCrumb="Connaître mon éligibilité"
      title={(
        <>
          Contacter
          {' '}
          <b>Santé Psy Étudiant</b>
        </>
      )}
      description={(
        <>
        Connaître mon éligibilité
        </>
      )}
    >
        <form className={styles.contactForm} onSubmit={submit}>
            <TextInput
                className={styles.input}
                data-test-id="ine-input"
                label="INE"
                value={INE}
                onChange={e => setINE(e.target.value)}
            />
            <TextInput
              data-test-id="formation-input"
              required
              label="Nom de la formation ou du diplôme"
              value={formation}
              onChange={e => setFormation(e.target.value)}
            />
            <TextInput
              data-test-id="establishment-input"
              required
              label="Nom de l'établissement"
              value={establishment}
              onChange={e => setEstablishment(e.target.value)}
            />
            <TextInput
              data-test-id="email-input"
              required
              type="email"
              label="Email pour vous répondre"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button data-test-id="eligibility-send-button" submit>Envoyer ma demande</Button>
        </form>
    </Page>
  );
};

export default observer(StudentEligibilityContact);
