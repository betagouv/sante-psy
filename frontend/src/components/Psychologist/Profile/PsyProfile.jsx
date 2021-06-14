import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import ViewProfile from 'components/Psychologist/Profile/ViewProfile';
import EditProfile from 'components/Psychologist/Profile/EditProfile';

import agent from 'services/agent';

import { useStore } from 'stores';

const PsyProfile = () => {
  const { commonStore: { setNotification } } = useStore();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [psychologist, setPsychologist] = useState();

  useEffect(() => {
    agent.Psychologist.getProfile().then(response => {
      setPsychologist(response.psychologist);
      setLoading(false);
    }).catch(() => {
      history.goBack();
    });
  }, []);

  const updatePsy = updatedPsychologist => {
    agent.Psychologist.updateProfile(updatedPsychologist)
      .then(response => {
        setPsychologist(updatedPsychologist);
        history.push('/psychologue/mon-profil');
        setNotification(response);
      })
      .catch(() => window.scrollTo(0, 0));
  };

  return (
    <Switch>
      <Route exact path="/psychologue/mon-profil">
        <ViewProfile
          psychologist={psychologist}
          loading={loading}
        />
      </Route>
      <Route exact path="/psychologue/mon-profil/modifier">
        <EditProfile
          psychologist={psychologist}
          updatePsy={updatePsy}
          loading={loading}
        />
      </Route>
    </Switch>
  );
};

export default PsyProfile;
