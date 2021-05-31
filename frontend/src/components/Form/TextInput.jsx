import React from 'react';

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
      <label
        className="fr-label"
        htmlFor={field}
        aria-describedby={`${field}-help`}
      >
        {label}
        {required && <span className="red-text"> *</span>}
      </label>
      {hint && (
      <div
        className="fr-hint-text"
        id={`${field}-help`}
      >
        {hint}
      </div>
      )}
      {type === 'textarea'
        ? <textarea {...inputOption} />
        : <input {...inputOption} />}
    </div>
  );
};

export default TextInput;
