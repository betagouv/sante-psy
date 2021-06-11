import React, { forwardRef } from 'react';

const DateInput = forwardRef(({ value, onClick, label, dataTestId }, ref) => (
  <div onClick={onClick} ref={ref}>
    {label && <label className="fr-label" htmlFor="date">{label}</label>}
    <input
      data-test-id={dataTestId}
      className="fr-input short-input"
      type="text"
      id="date"
      name="date"
      required
      autoComplete="off"
      onChange={() => {}}
      value={value}
    />
  </div>
));

export default DateInput;
