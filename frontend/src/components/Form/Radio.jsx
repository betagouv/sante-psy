import React from 'react';

import Label from './Label';

const Radio = ({ value, options, field, required, label, hint, onChange }) => (
  <div className="fr-form-group">
    <fieldset className="fr-fieldset">
      <Label
        field={field}
        label={label}
        required={required}
        hint={hint}
      />
      <div className="fr-fieldset__content">
        {options.map(option => (
          <div className="fr-radio-group" key={option.id}>
            <input
              data-test-id={`${field}-${option.id}`}
              type="radio"
              id={`${field}-${option.id}`}
              name={field}
              required={required}
              checked={value === option.id}
              onChange={() => { onChange(option.id, field); }}
            />
            <label className="fr-label" htmlFor={`${field}-${option.id}`}>{option.label}</label>
          </div>
        ))}
      </div>
    </fieldset>
  </div>
);

export default Radio;
