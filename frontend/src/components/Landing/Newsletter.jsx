import { Alert, Button, TextInput } from '@dataesr/react-dsfr';
import React, { useState } from 'react';
import agent from 'services/agent';
import styles from './newsletter.cssmodule.scss';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState();

  const onSubmit = event => {
    event.preventDefault();
    if (email) {
      agent.Student.sendMail(email)
        .then(response => {
          setNotification({ type: 'success', message: response.data.message });
        })
        .catch(e => {
          setNotification({ type: 'error', message: e.response.data });
        });
    }
  };
  return (
    notification
      ? <Alert className={styles.alert} type={notification.type} title={notification.message} />
      : (
        <div className={styles.container}>
          <img src="/images/newsletter.svg" alt="Newsletter" className={styles.logo} />
          <div className={styles.separator} />
          <form
            className={styles.form}
            onSubmit={onSubmit}
          >
            <TextInput
              placeholder="Votre e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              submit
            >
              Suivez le guide
            </Button>
          </form>
        </div>
      )
  );
};

export default Newsletter;
