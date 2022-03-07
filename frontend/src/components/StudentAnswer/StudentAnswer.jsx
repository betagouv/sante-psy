import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useStore } from 'stores/';
import { Row, Text } from '@dataesr/react-dsfr';
import Page from 'components/Page/Page';
import Vote from 'components/StudentAnswer/Vote';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';
import styles from './studentAnswer.cssmodule.scss';

const StudentAnswer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { commonStore: { setNotification } } = useStore();
  const [selected, setSelected] = useState();

  const onClick = referral => {
    setSelected(referral);
    setNotification({});
    agent.Student.saveAnswer({ id, referral })
      .then(notification => {
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
    });
  }, []);

  return (
    <Page title="" background="blue" description="Merci d'avoir pris le temps de répondre 🙂">
      {searchParams.get('appointment')
        && (
          <>
            <Text className={styles.question}>
              Recommanderais-tu Santé Psy Étudiant à d’autres étudiants et étudiantes&nbsp;?
            </Text>
            <Row className={styles.votes}>
              <Vote
                background={selected === 1 ? 'blue' : null}
                image="bad"
                label="Non"
                onClick={() => onClick(1)}
              />
              <Vote
                background={selected === 2 ? 'blue' : null}
                image="medium"
                label="Moyen"
                onClick={() => onClick(2)}
              />
              <Vote
                background={selected === 3 ? 'blue' : null}
                image="good"
                label="Oui"
                onClick={() => onClick(3)}
              />
            </Row>
            <GlobalNotification />
          </>
        )}
    </Page>
  );
};

export default StudentAnswer;
