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

  const nextStep = (index, increment) => {
    const nextIndex = increment(index);
    const currentStep = steps[nextIndex];
    if (currentStep.shouldSkip) {
      return currentStep.shouldSkip(user).then(shouldSkip => {
        if (shouldSkip) {
          return nextStep(nextIndex, increment);
        }
        return nextIndex;
      });
    }
    return Promise.resolve(nextIndex);
  };

  const joyrideCallback = data => {
    const { action, type, index, step } = data;
    const finishedAction = [ACTIONS.CLOSE, ACTIONS.SKIP];
    if (__MATOMO__) {
      if (action === ACTIONS.START) {
        _paq.push(['trackEvent', 'Tuto', user.hasSeenTutorial ? id : 'global', 'begin']);
      }
      if (action === ACTIONS.CLOSE) {
        _paq.push(['trackEvent', 'Tuto', user.hasSeenTutorial ? id : 'global', 'end']);
      }
    }

    if (finishedAction.includes(action)) {
      if (!user.hasSeenTutorial) {
        seeTutorial();
      }
      setTutoStatus({ run: false, stepIndex: index });
    } else if (type === EVENTS.STEP_AFTER) {
      if (step.onNext && action === ACTIONS.NEXT) {
        step.onNext(history);
      } else if (step.onPrevious && action === ACTIONS.PREV) {
        step.onPrevious(history);
      }

      const increment = i => (action === ACTIONS.NEXT ? i + 1 : i - 1);
      nextStep(index, increment).then(stepIndex => setTutoStatus({ run: tutoStatus.run, stepIndex }));
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
