import React from "react";
import { observer } from "mobx-react";
import { EligibilityQuestionIds, EligibilityOptions } from "../utils/eligibilitySteps";
import { renderEligibilityQuestion } from "../utils/renderEligibilityQuestion";

const CloseEligibility = ({ answers, onNext }) => {
  return (
    <>
      {renderEligibilityQuestion(
        EligibilityQuestionIds.STUDENT_STATUS,
        (answer) => onNext("isStudentClose", answer)
      )}

      {answers.isStudentClose === EligibilityOptions.STUDENT.YES &&
        renderEligibilityQuestion(
          EligibilityQuestionIds.CLOSE_TRAINING,
          (answer) => onNext("formationClose", answer)
        )}

      {answers.formationClose === EligibilityOptions.TRAINING.OTHER &&
        renderEligibilityQuestion(
          EligibilityQuestionIds.CLOSE_PROOF,
          (answer) => onNext("otherEligibilityClose", answer)
        )}
    </>
  );
};

export default observer(CloseEligibility);
