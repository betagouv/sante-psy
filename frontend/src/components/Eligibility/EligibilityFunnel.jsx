import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import EligibilityMessage from './components/EligibilityMessage';
import SelfEligibility from './steps/SelfEligibility';
import CloseEligibility from './steps/CloseEligibility';
import SchoolEligibility from './steps/SchoolEligibility';
import ConsultantEligibility from './steps/ConsultantEligibility';
import { checkEligibility, checkIneligibility } from './utils/eligibilityChecker';
import { renderEligibilityQuestion } from './utils/renderEligibilityQuestion';
import { EligibilityQuestionIds, EligibilityOptions } from './utils/eligibilitySteps';
import styles from './eligibilityStyles.cssmodule.scss'
import { Container } from '@dataesr/react-dsfr';

const EligibilityFunnel = () => {
  const [answers, setAnswers] = useState({});
  const [eligibilityStatus, setEligibilityStatus] = useState(null);

  const handleNextStep = (questionId, answer) => {
    setEligibilityStatus(null);
    
    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers, [questionId]: answer };
  
      switch (questionId) {
        case EligibilityQuestionIds.WHO_FOR:
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
          break;
  
        case EligibilityQuestionIds.ARE_YOU_STUDENT:
          delete newAnswers.formation;
          delete newAnswers.otherEligibility;
          break;
  
        case EligibilityQuestionIds.WHAT_TRAINING:
          delete newAnswers.otherEligibility;
          break;
  
        case EligibilityQuestionIds.SCHOOL_TRAINING:
          break;
  
  
        default:
          break;
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
    <Container
      spacing="py-4w"
    >
      <div className={styles.eligibilityForm}>
        <div className={styles.bubbleSpeechPerson}>
          <img src={`/images/purple-speech-bubble.svg`} alt="purple speech bubble" width={180}/>
          <img src={`/images/psychologist.svg`} alt="purple speech bubble" width={160}/>
        </div>
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
    </Container>
  );
};

export default observer(EligibilityFunnel);
