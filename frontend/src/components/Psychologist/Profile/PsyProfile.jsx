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
      if (response.success) {
        setPsychologist({ ...response.psychologist });
        setLoading(false);
      } else {
        history.goBack();
        setNotification(response);
      }
    });
  }, []);

  const save = e => {
    e.preventDefault();
    agent.Psychologist.updateProfile(psychologist).then(response => {
      if (response.success) {
        history.push('/psychologue/mon-profil');
      }
      window.scrollTo(0, 0);
      setNotification(response);
    });
  };

  const changePsychologist = (value, field) => {
    setPsychologist({ ...psychologist, [field]: value });
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
          changePsychologist={changePsychologist}
          save={save}
          loading={loading}
        />
      </Route>
    </Switch>
  );
};

export default PsyProfile;
