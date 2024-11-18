import React, { useState } from "react";
import { Radio, RadioGroup, Icon } from "@dataesr/react-dsfr";
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
              value={option.label}
            />
            {option.tooltip && (
              <div className={styles.answerWithTooltip}>
                <span className={styles.tooltip}>{option.tooltip}</span>
                <Icon
                  name="ri-information-line"
                  color="#000091"
                  size="lg"
                  className={styles.iconInfo}
                />
              </div>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionStep;
