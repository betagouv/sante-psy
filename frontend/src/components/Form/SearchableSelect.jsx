import React, { useState } from 'react';
import classnames from 'classnames';

import Label from './Label';

import styles from './searchableSelect.cssmodule.scss';

const SearchableSelect = ({
  label,
  hint,
  type,
  required,
  field,
  options,
  onChange,
  hiddenOption,
  value,
  ...remainingProps
}) => {
  const inputOption = {
    ...remainingProps,
    className: 'fr-select midlength-input',
    autoComplete: 'off',
    id: field,
    type,
    required,
    value,
    onChange: e => setInternalValue(e.target.value),
  };

  const [internalValue, setInternalValue] = useState(value);
  const [showOptions, setShowOptions] = useState(false);

  const onInternalChange = (id, newValue) => {
    setInternalValue(newValue);
    onChange(id, field);
  };

  const onFocus = () => {
    onInternalChange('', '');
    setShowOptions(true);
  };

  const onBlur = () => {
    if (filteredOptions.length === 1) {
      onInternalChange(filteredOptions[0].id, filteredOptions[0].label);
    } else {
      const foundValue = options.find(option => option.label === internalValue);
      if (!foundValue) {
        setInternalValue('');
      }
    }
    setShowOptions(false);
  };

  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(internalValue.toLowerCase()));
  return (
    <div className="fr-my-3w">
      <Label
        field={field}
        label={label}
        required={required}
        hint={hint}
      />
      <input
        {...inputOption}
        onFocus={onFocus}
        onBlur={onBlur}
        value={internalValue}
      />
      <div
        className={classnames(styles.select, 'midlength-input', { [styles.display]: showOptions })}
      >
        {filteredOptions.length === 0 ? (
          <div className={styles.optionNonClickable}>
            Aucun résultat
          </div>
        ) : (
          <>
            {hiddenOption && <option value="" disabled hidden>{hiddenOption}</option>}
            {filteredOptions.map(option => (
              <div
                className={styles.option}
                key={option.id}
                value={option.id}
                onMouseDown={() => onInternalChange(option.id, option.label)}
              >
                {option.label}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchableSelect;
