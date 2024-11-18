import React from "react";
import { EligibilityQuestionIds, EligibilityOptions } from "../utils/eligibilitySteps";
import { observer } from "mobx-react";
import { renderEligibilityQuestion } from "../utils/renderEligibilityQuestion";

const SchoolEligibility = ({ answers, onNext }) => {
  return (
    <>
      {renderEligibilityQuestion(
        EligibilityQuestionIds.SCHOOL_TRAINING,
        (answer) => onNext("formationSchool", answer)
      )}

      {answers.formationSchool === EligibilityOptions.TRAINING.OTHER &&
        renderEligibilityQuestion(
          EligibilityQuestionIds.SCHOOL_PROOF,
          (answer) => onNext("otherEligibilitySchool", answer)
        )}
    </>
  );
};

export default observer(SchoolEligibility);
