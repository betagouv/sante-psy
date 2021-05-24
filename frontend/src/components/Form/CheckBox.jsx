import React from 'react';

const CheckBox = ({ label, hint, type, required, field, onChange, ...remainingProps }) => (
  <div className="fr-my-3w fr-checkbox-group">
    <input
      {...remainingProps}
      onChange={e => {
        onChange(e.target.checked, field);
      }}
      id={field}
      type="checkbox"
    />
    <label
      className="fr-label"
      htmlFor={field}
      aria-describedby={`${field}-help`}
    >
      {label}
      {required && <span className="red-text"> *</span>}
      {hint && (
        <span
          className="fr-hint-text"
          id={`${field}-help`}
        >
            {hint}
        </span>
      )}
    </label>
  </div>
);

export default CheckBox;
