import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Page from 'components/Page/Page';
import agent from 'services/agent';

const StudentAnswer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    agent.Student.saveAnswer({
      id,
      letter: searchParams.get('letter'),
      appointment: searchParams.get('appointment'),
      referral: searchParams.get('referral'),
    });
  }, []);

  return (
    <Page
      background="blue"
      title="Merci"
      description="Merci d'avoir pris le temps de répondre :)"
    />
  );
};

export default StudentAnswer;
