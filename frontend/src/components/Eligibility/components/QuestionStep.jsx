import React from 'react';
import styles from './questionStep.cssmodule.scss';
import { Tooltip } from 'components/Tooltip/Tooltip';

const QuestionStep = ({ question, options, onNext, currentAnswer }) => (
  <div>
    <fieldset className="fr-fieldset">
      <legend className="fr-fieldset__legend">
        <div className={styles.purpleBackgroundText}>{question}</div>
      </legend>
      <div className="fr-fieldset__content">
        {options.map((option) => (
          <div
            key={option.label}
            className={`fr-radio-group ${styles.optionWrapper}`}
          >
            <input
              type="radio"
              id={option.label}
              value={option.label}
              checked={currentAnswer === option.value}
              onChange={() => onNext(option)}
            />
            <label className="fr-label" htmlFor={option.label}>
              {option.label}
            </label>
            {option.tooltip && (
              <Tooltip tooltip={option.tooltip}>
                <span
                  className={`fr-icon-information-line ${styles.iconInfo}`}
                  style={{ color: '#000091' }}
                />
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  </div>
);
export default QuestionStep;
