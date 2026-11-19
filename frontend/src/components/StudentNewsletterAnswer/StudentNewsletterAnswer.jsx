import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useStore } from 'stores/';
import Slice from 'components/Slice/Slice';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';
import styles from './studentNewsletterAnswer.cssmodule.scss';

const StudentNewsletterAnswer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const {
    commonStore: { setNotification },
  } = useStore();
  const [success, setSuccess] = useState(false);

  const onClick = (referral) => {
    setSuccess(false);
    setNotification({});
    agent.StudentNewsletter.saveAnswer({ id, referral })
      .then((notification) => {
        setSuccess(true);
        setNotification(notification.data, true, false);
      })
      .catch((e) => {
        setNotification(e.response.data, false, false);
      });
  };

  useEffect(() => {
    agent.StudentNewsletter.saveAnswer({
      id,
      letter: searchParams.get('letter'),
      appointment: searchParams.get('appointment'),
      doctorAppointment: searchParams.get('doctorAppointment'),
      doctorAppointment2: searchParams.get('doctorAppointment2'),
    });
  }, []);

  return (
    <Slice
      color="secondary"
      centerText
      centerTitle
      description={<b>Merci d&lsquo;avoir pris le temps de répondre 🙂</b>}
    >
      {searchParams.get('appointment') && !success && (
        <>
          <div className={styles.question}>
            Recommanderais-tu Santé Psy Étudiant à d’autres étudiants et
            étudiantes&nbsp;?
          </div>
          <ButtonsGroup
            inlineLayoutWhen="sm and up"
            alignment="center"
            buttons={[
              { children: 'Non', onClick: () => onClick(1) },
              { children: 'Moyen', onClick: () => onClick(2) },
              { children: 'Oui', onClick: () => onClick(3) },
            ]}
          />
        </>
      )}
      <GlobalNotification />
    </Slice>
  );
};

export default StudentNewsletterAnswer;
