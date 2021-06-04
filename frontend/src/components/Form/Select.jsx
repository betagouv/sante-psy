import React from 'react';

import Label from './Label';

const Select = ({ label, hint, type, required, field, options, onChange, hiddenOption, ...remainingProps }) => {
  const inputOption = {
    ...remainingProps,
    className: 'fr-select midlength-input',
    id: field,
    type,
    required,
    onChange: e => { onChange(e.target.value, field); },
  };
  return (
    <div className="fr-my-3w">
      <Label
        field={field}
        label={label}
        required={required}
        hint={hint}
      />
      <select {...inputOption}>
        {hiddenOption && <option value="" disabled hidden>{hiddenOption}</option>}
        {options.map(option => (
          <option
            key={option.id}
            value={option.id}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
