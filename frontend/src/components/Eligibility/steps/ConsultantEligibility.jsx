import React from "react";
import { observer } from "mobx-react";
import { EligibilityQuestionIds, EligibilityOptions } from "../utils/eligibilitySteps";
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
          EligibilityQuestionIds.CONSULTANT_PROOF,
          (answer) => onNext("otherEligibilityConsult", answer)
        )}
    </>
  );
};

export default observer(ConsultantEligibility);
