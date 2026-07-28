import React from 'react';
import { Radio, RadioGroup, Icon } from '@dataesr/react-dsfr';
import styles from './questionStep.cssmodule.scss';
import { Tooltip } from 'components/Tooltip/Tooltip';

const QuestionStep = ({ question, options, onNext, currentAnswer }) => (
  <div>
    <RadioGroup
      legend={<div className={styles.purpleBackgroundText}>{question}</div>}
    >
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
            <Tooltip tooltip={option.tooltip}>
              <Icon
                name="ri-information-line"
                color="#000091"
                size="lg"
                className={styles.iconInfo}
              />
            </Tooltip>
          )}
        </div>
      ))}
    </RadioGroup>
  </div>
);
export default QuestionStep;
