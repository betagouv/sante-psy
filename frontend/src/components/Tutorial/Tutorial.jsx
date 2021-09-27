import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, STATUS, EVENTS } from 'react-joyride';
import { useStore } from 'stores/';

import Modal from './Modal';
import getSteps from './Steps';

const Tutorial = ({ children, tutoStatus, setTutoStatus, id }) => {
  const { userStore: { user, seeTutorial } } = useStore();
  const [steps, setSteps] = useState(getSteps(id));

  useEffect(() => {
    setSteps(getSteps(id));
  }, [id]);

  useEffect(() => {
    if (user && !user.hasSeenTutorial) {
      setSteps(getSteps('global'));
      setTutoStatus({ run: true, stepIndex: 0 });
    } else {
      setSteps(getSteps(id));
    }
  }, [user.hasSeenTutorial]);

  const joyrideCallback = data => {
    const { action, status, type, index } = data;
    const finishedAction = [ACTIONS.CLOSE, ACTIONS.SKIP];
    const finishedStatus = [STATUS.FINISHED];
    if (finishedAction.includes(action) || finishedStatus.includes(status)) {
      if (!user.hasSeenTutorial) {
        seeTutorial();
      }
      setTutoStatus({ run: false, stepIndex: index });
    } else if (type === EVENTS.STEP_AFTER) {
      const stepIndex = action === ACTIONS.NEXT ? index + 1 : index - 1;
      setTutoStatus({ run: tutoStatus.run, stepIndex });
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
