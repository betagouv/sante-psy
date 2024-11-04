import React, { useState } from 'react';
import { Radio, RadioGroup } from '@dataesr/react-dsfr';

const QuestionStep = ({ question, options, onNext }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onNext(option);
  };

  return (
    <div>
      <h3>{question}</h3>
      <RadioGroup legend={question}>
        {options.map((option) => (
          <Radio
            key={option}
            label={option}
            checked={selectedOption === option}
            onChange={() => handleOptionChange(option)}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionStep;
