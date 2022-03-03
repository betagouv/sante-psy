import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Row, Text } from '@dataesr/react-dsfr';
import Page from 'components/Page/Page';
import Vote from 'components/StudentAnswer/Vote';
import agent from 'services/agent';
import styles from './studentAnswer.cssmodule.scss';

const StudentAnswer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState();

  const onClick = referral => {
    setSelected(referral);
    agent.Student.saveAnswer({
      id,
      referral,
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
    <Page background="blue" description="Merci d'avoir pris le temps de répondre :)">
      {searchParams.get('appointment')
        && (
        <>
          <Text>Recommanderais-tu Santé Psy Étudiant à d’autres étudiants et étudiantes&nbsp;?</Text>
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
        </>
        )}
    </Page>
  );
};

export default StudentAnswer;
