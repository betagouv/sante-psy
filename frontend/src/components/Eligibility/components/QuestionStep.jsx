import React from "react";
import { Radio, RadioGroup, Icon } from "@dataesr/react-dsfr";
import styles from "./questionStep.cssmodule.scss";

const QuestionStep = ({ question, options, onNext, currentAnswer }) => {
  return (
    <div>
      <RadioGroup legend={<div className={styles.purpleBackgroundText}>{question}</div>}>
        {options.map((option) => (
          <div key={option.label} className={styles.optionWrapper}>
            <Radio
              label={option.label}
              checked={currentAnswer === option.value}
              onChange={() => onNext(option)}
              value={option.label}
              defaultChecked={false}
            />
            {option.tooltip && (
              <div className={styles.hoverElement}>
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
