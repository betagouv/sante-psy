import React, { useState } from 'react';
import { observer } from 'mobx-react';
import StudentEligibilityStepOne from './StudentEligibilityStepOne.jsx';
import StudentEligibilityStepTwo from './StudentEligibilityStepTwo.jsx';
import StudentEligibilityStepThree from './StudentEligibilityStepThree.jsx';

const StudentEligibilityTunnel = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
  }

  return (
    <>
      {currentStep === 1 && <StudentEligibilityStepOne onStepChange={handleNextStep} />}
      {currentStep === 2 && <StudentEligibilityStepTwo onStepChange={handleNextStep} />}
      {currentStep === 3 && <StudentEligibilityStepThree/>}

    </>
  );
};

export default observer(StudentEligibilityTunnel);
