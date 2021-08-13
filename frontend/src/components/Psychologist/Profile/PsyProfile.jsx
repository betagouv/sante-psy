import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import ViewProfile from 'components/Psychologist/Profile/ViewProfile';
import SuspendProfile from 'components/Psychologist/Profile/SuspendProfile';
import EditProfile from 'components/Psychologist/Profile/EditProfile';

import agent from 'services/agent';

import { useStore } from 'stores';

const PsyProfile = () => {
  const { commonStore: { setNotification }, userStore: { pullUser } } = useStore();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [psychologist, setPsychologist] = useState();

  const loadPsychologist = () => {
    pullUser();
    agent.Psychologist.getProfile().then(response => {
      setPsychologist(response);
      setLoading(false);
    }).catch(() => {
      history.goBack();
    });
  };

  useEffect(() => {
    loadPsychologist();
  }, []);

  const updatePsy = updatedPsychologist => {
    agent.Psychologist.updateProfile(updatedPsychologist)
      .then(response => {
        loadPsychologist();
        history.push('/psychologue/mon-profil');
        setNotification(response);
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const suspendPsychologist = (reason, date) => {
    agent.Psychologist.suspend(reason, date)
      .then(response => {
        loadPsychologist();
        history.push('/psychologue/mon-profil');
        setNotification(response);
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const activatePsychologist = () => {
    agent.Psychologist.activate()
      .then(response => {
        loadPsychologist();
        history.push('/psychologue/mon-profil');
        setNotification(response);
      })
      .catch(() => window.scrollTo(0, 0));
  };

  return (
    <Switch>
      <Route exact path="/psychologue/mon-profil/suspendre">
        <SuspendProfile
          suspendPsychologist={suspendPsychologist}
        />
      </Route>
      <Route exact path="/psychologue/mon-profil/modifier">
        <EditProfile
          psychologist={psychologist}
          updatePsy={updatePsy}
          loading={loading}
        />
      </Route>
      <Route path="/psychologue/mon-profil">
        <ViewProfile
          psychologist={psychologist}
          loading={loading}
          activatePsychologist={activatePsychologist}
        />
      </Route>
    </Switch>
  );
};

export default PsyProfile;
