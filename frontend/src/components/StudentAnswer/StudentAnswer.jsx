import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useStore } from 'stores/';
import { ButtonGroup, Button, Text } from '@dataesr/react-dsfr';
import Page from 'components/Page/Page';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';
import styles from './studentAnswer.cssmodule.scss';

const StudentAnswer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { commonStore: { setNotification } } = useStore();
  const [success, setSuccess] = useState(false);

  const onClick = referral => {
    setSuccess(false);
    setNotification({});
    agent.Student.saveAnswer({ id, referral })
      .then(notification => {
        setSuccess(true);
        setNotification(notification.data, true, false);
      })
      .catch(e => {
        setNotification(e.response.data, false, false);
      });
  };

  useEffect(() => {
    agent.Student.saveAnswer({
      id,
      letter: searchParams.get('letter'),
      appointment: searchParams.get('appointment'),
      doctorAppointment: searchParams.get('doctorAppointment'),
      doctorAppointment2: searchParams.get('doctorAppointment2'),
    });
  }, []);

  return (
    <Page withoutHeader textContent>
      <GlobalNotification />
      <h1>Merci d&lsquo;avoir pris le temps de répondre 🙂</h1>
      {searchParams.get('appointment') && !success
        && (
          <>
            <Text className={styles.question}>
              Recommanderais-tu Santé Psy Étudiant à d’autres étudiants et étudiantes&nbsp;?
            </Text>
            <ButtonGroup align="center" isInlineFrom="md">
              <Button icon="ri-emotion-unhappy-line" onClick={() => onClick(1)}>Non</Button>
              <Button icon="ri-emotion-normal-line" onClick={() => onClick(2)}>Moyen</Button>
              <Button icon="ri-emotion-happy-line" onClick={() => onClick(3)}>Oui</Button>
            </ButtonGroup>
          </>
        )}
    </Page>
  );
};

export default StudentAnswer;
