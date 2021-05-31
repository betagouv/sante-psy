import React from 'react';

import Label from './Label';

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
    <Label
      field={field}
      label={label}
      required={required}
      hint={hint}
      inlineHint
    />
  </div>
);

export default CheckBox;
