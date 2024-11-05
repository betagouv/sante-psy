import React, { useState } from "react";
import { Radio, RadioGroup } from "@dataesr/react-dsfr";
import styles from "./questionStep.cssmodule.scss";

const QuestionStep = ({ question, options, onNext }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (option) => {
    setSelectedOption(option.label);
    onNext(option);
  };

  return (
    <div>
      <RadioGroup legend={<div className={styles.purpleBackgroundText}>{question}</div>}>
        {options.map((option) => (
          <div key={option.label} className={styles.optionWrapper}>
            <Radio
              label={option.label}
              checked={selectedOption === option.label}
              onChange={() => handleOptionChange(option)}
            />
            {option.tooltip && (
              <div className={styles.hoverElement}>
                <span className={styles.tooltip}>{option.tooltip}</span>
                <span class="fr-icon-information-line" aria-hidden="true"></span>
              </div>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionStep;
