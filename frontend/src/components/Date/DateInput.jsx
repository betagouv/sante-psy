import React, { forwardRef } from 'react';

const DateInput = forwardRef(({ value, onClick, label, dataTestId, required, id }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="midlength-input"
  >
    {label && (
    <label className="fr-label" htmlFor="date">
      {label}
      {required && <span className="error"> *</span>}
    </label>
    )}
    <input
      id={id}
      data-test-id={dataTestId}
      className="fr-input"
      type="text"
      name="date"
      required={required}
      autoComplete="off"
      onChange={() => {}}
      value={value}
    />
  </div>
));

export default DateInput;
