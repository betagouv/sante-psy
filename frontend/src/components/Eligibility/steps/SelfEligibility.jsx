import React from "react";
import { observer } from "mobx-react";
import { renderEligibilityQuestion } from "../utils/renderEligibilityQuestion";
import { EligibilityQuestionIds, EligibilityOptions } from "../utils/eligibilitySteps";

const SelfEligibility = ({ answers, onNext }) => {
  return (
    <>
      {renderEligibilityQuestion(
        EligibilityQuestionIds.ARE_YOU_STUDENT,
        (answer) => onNext("isStudent", answer)
      )}

      {answers.isStudent === EligibilityOptions.STUDENT.YES &&
        renderEligibilityQuestion(
          EligibilityQuestionIds.WHAT_TRAINING,
          (answer) => onNext("formation", answer)
        )}

      {answers.formation === EligibilityOptions.TRAINING.OTHER &&
        renderEligibilityQuestion(
          EligibilityQuestionIds.WHAT_PROOF,
          (answer) => onNext("otherEligibility", answer)
        )}
    </>
  );
};

export default observer(SelfEligibility);
