import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, STATUS, EVENTS } from 'react-joyride';
import { useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';

import Modal from './Modal';
import getSteps from './Steps';

const Tutorial = ({ children, tutoStatus, setTutoStatus, id }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { userStore: { user, seeTutorial } } = useStore();
  const [steps, setSteps] = useState(getSteps(id));

  useEffect(() => {
    if (user && !user.hasSeenTutorial) {
      setSteps(getSteps('global'));
      setTutoStatus({ run: true, stepIndex: 0 });
      if (pathname !== '/psychologue/mes-seances') {
        history.push('/psychologue/mes-seances');
      }
    } else {
      setSteps(getSteps(id));
    }
  }, [user.hasSeenTutorial]);

  useEffect(() => {
    function handleResize() {
      // Never show tuto in mobile view
      if (window.innerWidth < 992) {
        setTutoStatus({ run: false, stepIndex: 0 });
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const joyrideCallback = data => {
    const { action, status, type, index, step } = data;
    const finishedAction = [ACTIONS.CLOSE, ACTIONS.SKIP];
    const finishedStatus = [STATUS.FINISHED];
    if (finishedAction.includes(action) || finishedStatus.includes(status)) {
      if (!user.hasSeenTutorial) {
        seeTutorial();
      }
      setTutoStatus({ run: false, stepIndex: index });
    } else if (type === EVENTS.STEP_AFTER) {
      if (step.onClick) {
        step.onClick(history);
      }
      setTutoStatus({ run: tutoStatus.run, stepIndex: index + 1 });
    }
  };

  return (
    <>
      <Joyride
        run={tutoStatus.run}
        stepIndex={tutoStatus.stepIndex}
        callback={joyrideCallback}
        steps={steps}
        styles={{ overlay: { cursor: 'initial' } }}
        tooltipComponent={Modal}
        continuous
        disableScrollParentFix
        disableOverlayClose
      />
      {children}
    </>
  );
};

export default observer(Tutorial);
