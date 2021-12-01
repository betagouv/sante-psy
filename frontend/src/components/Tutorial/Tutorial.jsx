import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useStore } from 'stores/';

import Modal from './Modal';
import getSteps from './Steps';

const Tutorial = ({ children, tutoStatus, setTutoStatus, id }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userStore: { user, seeTutorial } } = useStore();
  const [steps, setSteps] = useState(getSteps(id));

  useEffect(() => {
    if (user && !user.hasSeenTutorial && !tutoStatus.run) {
      setTutoStatus({ run: true, stepIndex: 0 });
      if (pathname !== '/psychologue/mes-seances') {
        navigate('/psychologue/mes-seances');
      }
    }
  }, [user]);

  useEffect(() => { setSteps(getSteps(id)); }, [id]);

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
    if (currentStep && currentStep.shouldSkip) {
      return currentStep.shouldSkip(user).then(shouldSkip => {
        if (shouldSkip) {
          return nextStep(nextIndex, increment);
        }
        return nextIndex;
      });
    }
    return Promise.resolve(nextIndex);
  };

  const handleUserHasSeenTutorial = () => {
    if (!user.hasSeenTutorial && id === 'global') {
      seeTutorial();
    }
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
      handleUserHasSeenTutorial();
      setTutoStatus({ run: false, stepIndex: index });
    } else if (type === EVENTS.STEP_AFTER) {
      if (step.onNext && action === ACTIONS.NEXT) {
        step.onNext(navigate);
      } else if (step.onPrevious && action === ACTIONS.PREV) {
        step.onPrevious(navigate);
      }

      const increment = i => (action === ACTIONS.NEXT ? i + 1 : i - 1);
      nextStep(index, increment)
        .then(stepIndex => setTutoStatus({ run: stepIndex < steps.length ? tutoStatus.run : false, stepIndex }));
    } else if (type === EVENTS.TARGET_NOT_FOUND || type === EVENTS.ERROR) {
      // Consider user has seen tutorial in case of error to avoid blocking behavior
      handleUserHasSeenTutorial();
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
        scrollOffset={250}
      />
      {children}
    </>
  );
};

export default observer(Tutorial);
