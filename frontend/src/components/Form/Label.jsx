import React from 'react';

const TextInput = ({ label, hint, required, field, inlineHint }) => {
  const hintDiv = hint ? (
    <div
      className="fr-hint-text"
      id={`${field}-help`}
    >
      {hint}
    </div>
  ) : <></>;

  return (
    <>
      <label
        className="fr-label"
        htmlFor={field}
        aria-describedby={`${field}-help`}
      >
        {label}
        {required && <span className="red-text"> *</span>}
        {inlineHint && hintDiv}
      </label>
      {!inlineHint && hintDiv}
    </>
  );
};

export default TextInput;
