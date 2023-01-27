import React, { createRef, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import styles from './inputSelect.cssmodule.scss';

const InputSelect = ({
  id,
  label,
  className,
  options,
  selected,
  onChange,
  placeholder,
}) => {
  const selectId = useRef(id || uuidv4());
  const optionsRef = useRef([]);
  const optionsContainerRef = useRef();
  const [arrowSelected, setArrowSelected] = useState();
  const [internalLabel, setInternalLabel] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  if (options.length !== optionsRef.length) {
    optionsRef.current = Array(options.length)
      .fill()
      .map((option, i) => optionsRef.current[i] || createRef());
  }

  useEffect(() => {
    selectId.current = id || uuidv4();
  }, [id]);

  useEffect(() => {
    if (selected) {
      setInternalLabel(selected);
    } else {
      setInternalLabel('');
    }
  }, [selected]);

  useEffect(() => {
    if (arrowSelected) {
      optionsContainerRef.current.scrollTop = Math.max(
        0,
        optionsRef.current[arrowSelected].current.offsetTop - 20,
      );
    } else {
      optionsContainerRef.current.scrollTop = 0;
    }
  }, [arrowSelected]);

  const onInternalChange = (newValue, newLabel) => {
    setInternalLabel(newLabel);
    onChange(newValue);
  };

  const onInternalFocus = () => {
    setShowOptions(true);
    setArrowSelected(null);
  };

  const onInternalBlur = () => {
    setShowOptions(false);
  };

  const onInternalKeyDown = e => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setShowOptions(true);
        if (arrowSelected === null) {
          setArrowSelected(0);
        } else if (arrowSelected < options.filter(o => !o.disabled).length - 1) {
          setArrowSelected(arrowSelected + 1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setShowOptions(true);
        if (arrowSelected && arrowSelected > 0) {
          setArrowSelected(arrowSelected - 1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (arrowSelected !== null) {
          const option = options.filter(o => !o.disabled)[arrowSelected];
          onInternalChange(option.value, option.label);
        }
        setShowOptions(false);
        break;
      default:
        setArrowSelected(null);
    }
  };

  let refCount = -1;
  return (
    <div className={className}>
      <label
        className="fr-label"
        htmlFor={selectId.current}
      >
        {label}
      </label>
      <div className={styles.selectSearchInput}>
        <input
          id={selectId.current}
          className="fr-select"
          autoComplete="off"
          onChange={e => onInternalChange(e.target.value, e.target.label)}
          onFocus={onInternalFocus}
          onBlur={onInternalBlur}
          onKeyDown={onInternalKeyDown}
          value={internalLabel}
          placeholder={placeholder}
        />
        <div
          ref={optionsContainerRef}
          className={classNames(
            styles.selectSearchOptions,
            'midlength-input',
            showOptions ? styles.selectSearchOptions__visible : null,
          )}
        >
          {options.map(option => {
            if (!option.disabled) {
              refCount += 1;
            }

            return (
              <option
                ref={option.disabled ? null : optionsRef.current[refCount]}
                className={classNames(
                  styles.selectSearchOption,
                  !option.disabled && refCount === arrowSelected ? styles.selectSearchOption__selected : null,
                  option.disabled ? styles.selectSearchOption__disabled : null,
                )}
                disabled={option.disabled || false}
                hidden={option.hidden || false}
                key={`${selectId}-${option.value}`}
                value={option.value}
                onMouseDown={() => onInternalChange(option.value, option.label)}
              >
                {option.label}
              </option>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InputSelect;
