import React from 'react';
import { EligibilityQuestions } from './eligibilityQuestions';
import QuestionStep from '../components/QuestionStep';

export const renderEligibilityQuestion = (questionId, onNext) => {
  const question = EligibilityQuestions[questionId];
  return (
    <QuestionStep
      question={question.question}
      options={question.options}
      onNext={onNext}
    />
  );
};
