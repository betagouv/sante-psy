import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Container } from '@dataesr/react-dsfr';
import EligibilityMessage from './components/EligibilityMessage';
import QuestionStep from './components/QuestionStep';
import styles from './eligibilityStyles.cssmodule.scss';
import { EligibilitySteps } from './utils/eligibilitySteps';

const EligibilityFunnel = () => {
  const [answers, setAnswers] = useState({});
  const [eligibilityStatus, setEligibilityStatus] = useState(null);
  const [visibleSteps, setVisibleSteps] = useState(['STEP_1']);
  const getStep = stepId => EligibilitySteps.find(step => step.id === stepId);
  const recalculateSteps = (updatedAnswers, modifiedStepId) => {
    setEligibilityStatus(null);
    const newVisibleSteps = [];
    let nextStepId = 'STEP_1';
    while (nextStepId) {
      const currentStep = getStep(nextStepId);
      if (!currentStep) break;
      newVisibleSteps.push(nextStepId);
      if (newVisibleSteps.includes(modifiedStepId)
          && newVisibleSteps.indexOf(modifiedStepId) < newVisibleSteps.length - 1) {
        updatedAnswers[nextStepId] = undefined;
        break;
      }
      const currentAnswer = updatedAnswers[nextStepId];
      if (currentAnswer?.eligible !== undefined) {
        setEligibilityStatus(currentAnswer.eligible);
        break;
      }
      nextStepId = currentStep.next(currentAnswer, updatedAnswers);
    }
    setAnswers(updatedAnswers);
    setVisibleSteps(newVisibleSteps);
  };
  const handleAnswerChange = (stepId, newAnswer) => {
    const updatedAnswers = { ...answers, [stepId]: newAnswer };
    recalculateSteps(updatedAnswers, stepId);
  };
  const renderQuestions = () => visibleSteps.map(stepId => {
    const step = getStep(stepId);
    const isCurrent = stepId === visibleSteps[visibleSteps.length - 1];
    return (
      <QuestionStep
        key={stepId}
        question={step.getQuestion(answers)}
        options={step.getOptions(answers)}
        onNext={answer => handleAnswerChange(stepId, answer)}
        isCurrent={isCurrent}
        currentAnswer={answers[stepId]?.value}
        />
    );
  });
  return (
    <Container spacing="py-4w">
      <div className={styles.eligibilityForm}>
        <div className={styles.bubbleSpeechPerson}>
          <img src="/images/purple-speech-bubble.svg" alt="purple speech bubble" width={180} />
          <img src="/images/psychologist.svg" alt="person with laptop" width={160} />
        </div>
        {renderQuestions()}
        {eligibilityStatus !== null && (
        <EligibilityMessage
          isEligible={eligibilityStatus}
          lastAnswerValue={Object.values(answers).at(-1)?.value}
          whoFor={answers?.STEP_1?.value}
        />
        )}
      </div>
    </Container>
  );
};
export default observer(EligibilityFunnel);
