import React, { forwardRef, useState } from 'react';
import { TextInput } from '@dataesr/react-dsfr';

const DateInput = forwardRef(({ value, onClick, label, dataTestId, required }, ref) => {
  const [changed, setChanged] = useState(false);
  const status = changed
    ? {
      message: value ? '' : 'Veuillez renseigner ce champ.',
      messageType: value ? 'valid' : 'error',
    }
    : {};
  return (
    <div
      onClick={onClick}
      ref={ref}
      className="midlength-input"
    >
      <TextInput
        data-test-id={dataTestId}
        label={label}
        required={required}
        id="date"
        name="date"
        autoComplete="off"
        value={value}
        onChange={() => {}}
        onBlur={() => setChanged(true)}
        {...status}
      />
    </div>
  );
});

export default DateInput;
