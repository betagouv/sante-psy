import React, { forwardRef } from 'react';

const DateInput = forwardRef(({ value, onClick, label }, ref) => (
  <div onClick={onClick} ref={ref}>
    {label && <label className="fr-label" htmlFor="date">{label}</label>}
    <input
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
