import React from 'react';

import Label from './Label';

const TextInput = ({ label, hint, type, required, field, onChange, ...remainingProps }) => {
  const inputOption = {
    ...remainingProps,
    className: 'fr-input midlength-input',
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
      {type === 'textarea'
        ? <textarea {...inputOption} />
        : <input {...inputOption} />}
    </div>
  );
};

export default TextInput;
