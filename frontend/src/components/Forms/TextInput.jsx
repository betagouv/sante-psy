import { React, useEffect, useMemo, useState } from 'react';
import styles from './TextInput.cssmodule.scss';

export const TextInput = ({
  id,
  disabled,
  label,
  fieldName,
  validator,
  setValue,
  setValid,
  formatter,
  hint,
  placeholder,
  successMessage,
}) => {
  const [innerValue, setInnerValue] = useState('');
  const [touched, setTouched] = useState(false);

  const error = useMemo(() => {
    if (!touched) {
      return '';
    }
    if (!innerValue) {
      return `Le champ ${fieldName} est requis.`;
    }
    if (validator(innerValue)) {
      return '';
    }
    return `Le format du champ ${fieldName} est incorrect.`;
  }, [fieldName, validator, innerValue, touched]);

  useEffect(() => {
    setValid(!!innerValue && !error && touched);
    setValue(innerValue);
  }, [setValid, error, innerValue, touched]);

  const inputId = `${id}-input`;

  return (
    <div className="fr-input-group">
      <label className="fr-label" htmlFor={inputId}>
        {label}
        {hint && <span className="fr-hint-text">{hint}</span>}
      </label>
      <input
        className={`fr-input midlength-input ${error ? 'fr-input--error' : ''}`}
        id={inputId}
        type="text"
        value={innerValue}
        onChange={(e) =>
          setInnerValue(formatter ? formatter(e.target.value) : e.target.value)
        }
        onBlur={() => setTouched(true)}
        required
        disabled={disabled}
        placeholder={placeholder}
      />
      {error && <p className="fr-error-text">{error}</p>}
      {!error && successMessage && (
        <p className={styles.success}>{successMessage}</p>
      )}
    </div>
  );
};
