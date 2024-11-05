import React from "react";
import { EligibilityQuestionIds, EligibilityOptions } from "../utils/eligibilityQuestions";
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
          EligibilityQuestionIds.ELIGIBILITY_OPTIONS,
          (answer) => onNext("otherEligibilitySchool", answer)
        )}
    </>
  );
};

export default observer(SchoolEligibility);
