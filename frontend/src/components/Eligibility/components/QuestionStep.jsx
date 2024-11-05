import React, { useState } from "react";
import { Radio, RadioGroup } from "@dataesr/react-dsfr";
import styles from "./questionStep.cssmodule.scss";

const QuestionStep = ({ question, options, onNext }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onNext(option);
  };

  return (
    <div>
      <RadioGroup
        legend={<div className={styles.purpleBackgroundText}>{question}</div>}
      >
        {options.map((option) => (
          <div key={option} className={styles.optionWrapper}>
            <Radio
              label={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              value=""
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionStep;
