import React from "react";
import { observer } from "mobx-react";
import { EligibilityQuestionIds, EligibilityOptions } from "../utils/eligibilityQuestions";
import { renderEligibilityQuestion } from "../utils/renderEligibilityQuestion";

const ConsultantEligibility = ({ answers, onNext }) => {
  return (
    <>
      {renderEligibilityQuestion(
        EligibilityQuestionIds.CONSULTANT_TRAINING,
        (answer) => onNext("formationConsult", answer)
      )}

      {answers.formationConsult === EligibilityOptions.TRAINING.OTHER &&
        renderEligibilityQuestion(
          EligibilityQuestionIds.ELIGIBILITY_OPTIONS,
          (answer) => onNext("otherEligibilityConsult", answer)
        )}
    </>
  );
};

export default observer(ConsultantEligibility);
