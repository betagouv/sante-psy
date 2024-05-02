import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Page from 'components/Page/Page';
import agent from 'services/agent';

const ActiveProfile = () => {
  const { token } = useParams();

  useEffect(() => {
    agent.Psychologist.active(token);
  }, []);
  return (
    <Page
      title="Merci"
      description="Nous avons bien pris en compte votre réponse et vous remercions pour votre investissement !"
    />
  );
};

export default ActiveProfile;
