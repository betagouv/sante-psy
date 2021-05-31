import React from 'react';

const Select = ({ label, hint, type, required, field, options, onChange, ...remainingProps }) => {
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
        { options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
