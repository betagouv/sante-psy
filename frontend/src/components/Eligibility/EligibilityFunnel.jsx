import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import EligibilityMessage from './EligibilityMessage';
import SelfEligibility from './SelfEligibility';
import CloseEligibility from './CloseEligibility';
import SchoolEligibility from './SchoolEligibility';
import ConsultantEligibility from './ConsultantEligibility';
import { checkEligibility, checkIneligibility } from './utils/eligibilityChecker';
import { renderEligibilityQuestion } from './utils/renderEligibilityQuestion';
import { EligibilityQuestionIds, EligibilityOptions } from './utils/eligibilityQuestions';

const EligibilityFunnel = () => {
  const [answers, setAnswers] = useState({});
  const [eligibilityStatus, setEligibilityStatus] = useState(null); // État pour le statut d'éligibilité

  const handleNextStep = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers, [questionId]: answer };

      if (questionId === EligibilityQuestionIds.WHO_FOR) {
        delete newAnswers.isStudent;
        delete newAnswers.formation;
        delete newAnswers.otherEligibility;
        delete newAnswers.isStudentClose;
        delete newAnswers.formationClose;
        delete newAnswers.otherEligibilityClose;
        delete newAnswers.formationSchool;
        delete newAnswers.otherEligibilitySchool;
        delete newAnswers.formationConsult;
        delete newAnswers.otherEligibilityConsult;
      } else if (questionId === EligibilityQuestionIds.ARE_YOU_STUDENT) {
        delete newAnswers.formation;
        delete newAnswers.otherEligibility;
      } else if (questionId === EligibilityQuestionIds.WHAT_TRAINING && answer !== EligibilityOptions.TRAINING.OTHER) {
        delete newAnswers.otherEligibility;
      }

      return newAnswers;
    });
  };

  useEffect(() => {
    if (checkEligibility(answers)) {
      setEligibilityStatus(true);
    } else if (checkIneligibility(answers)) {
      setEligibilityStatus(false);
    } else {
      setEligibilityStatus(null);
    }
  }, [answers]);

  return (
    <div>
      <h2>Formulaire d'éligibilité</h2>

      {renderEligibilityQuestion(
        EligibilityQuestionIds.WHO_FOR,
        (answer) => handleNextStep(EligibilityQuestionIds.WHO_FOR, answer)
      )}

      {answers.whoFor === EligibilityOptions.WHO_FOR.ME && (
        <SelfEligibility answers={answers} onNext={handleNextStep} />
      )}

      {answers.whoFor === EligibilityOptions.WHO_FOR.CLOSE && (
        <CloseEligibility answers={answers} onNext={handleNextStep} />
      )}

      {answers.whoFor === EligibilityOptions.WHO_FOR.SCHOOL && (
        <SchoolEligibility answers={answers} onNext={handleNextStep} />
      )}

      {answers.whoFor === EligibilityOptions.WHO_FOR.CONSULTANT && (
        <ConsultantEligibility answers={answers} onNext={handleNextStep} />
      )}

      {eligibilityStatus !== null && (
        <EligibilityMessage isEligible={eligibilityStatus} />
      )}
    </div>
  );
};

export default observer(EligibilityFunnel);
