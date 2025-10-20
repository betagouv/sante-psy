import React, { createRef, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import addressAutocomplete from 'services/addressAutocomplete';

import styles from './addressAutocomplete.cssmodule.scss';

const AROUND_ME = 'Autour de moi';

const AddressAutocomplete = ({
    id,
    label,
    className,
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
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef();

    const fixedOptions = [{ value: AROUND_ME, label: AROUND_ME }];
    const allOptions = [...fixedOptions, ...suggestions];

    if (allOptions.length !== optionsRef.current.length) {
        optionsRef.current = Array(allOptions.length)
            .fill()
            .map((_, i) => optionsRef.current[i] || createRef());
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
        if (arrowSelected !== null && optionsContainerRef.current && optionsRef.current[arrowSelected]) {
            optionsContainerRef.current.scrollTop = Math.max(
                0,
                optionsRef.current[arrowSelected].current.offsetTop - 20,
            );
        } else if (optionsContainerRef.current) {
            optionsContainerRef.current.scrollTop = 0;
        }
    }, [arrowSelected]);

    const searchAddresses = async (query) => {
        if (!query || query.length < 2 || query === AROUND_ME) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const results = await addressAutocomplete.searchAddresses(query, 5);
            setSuggestions(results);
        } catch (error) {
            console.error('Autocomplete error:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const onInternalChange = (newValue, newLabel) => {
        setInternalLabel(newLabel || newValue);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            searchAddresses(newValue);
        }, 300);

        onChange(newValue);
    };

    const onInternalFocus = () => {
        setShowOptions(true);
        setArrowSelected(null);

        if (internalLabel && internalLabel !== AROUND_ME) {
            searchAddresses(internalLabel);
        }
    };

    const onInternalBlur = () => {
        setTimeout(() => {
            setShowOptions(false);
        }, 200);
    };

    const onInternalKeyDown = (e) => {
        const { key } = e;

        if (suggestions.length === 0) return;

        if (key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
        }

        if (key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
        }

        if (key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            onSelect(suggestions[selectedIndex]);
        }

        if (key === 'Escape') {
            setSuggestions([]);
            setSelectedIndex(-1);
        }
    };

    const selectOption = (option) => {
        onInternalChange(option.value, option.label);
        setShowOptions(false);
    };

    return (
        <div className={className}>
            <label
                className="fr-label"
                htmlFor={selectId.current}
            >
                {label}
            </label>
            <div className={styles.addressAutocomplete}>
                <input
                    id={selectId.current}
                    className="fr-select"
                    autoComplete="off"
                    onChange={e => onInternalChange(e.target.value)}
                    onFocus={onInternalFocus}
                    onBlur={onInternalBlur}
                    onKeyDown={onInternalKeyDown}
                    value={internalLabel}
                    placeholder={placeholder}
                />

                {showOptions && (
                    <div
                        ref={optionsContainerRef}
                        className={styles.addressOptions}
                    >
                        {isLoading && (
                            <div className={styles.addressOption}>
                                <span className="fr-icon-refresh-line" aria-hidden="true" />
                                recherche...
                            </div>
                        )}

                        {allOptions.map((option, index) => (
                            <div
                                ref={optionsRef.current[index]}
                                className={classNames(
                                    styles.addressOption,
                                    index === arrowSelected ? styles.addressOptionSelected : null,
                                )}
                                key={`${selectId.current}-${option.value}-${index}`}
                                onMouseDown={() => selectOption(option)}
                                onMouseEnter={() => setArrowSelected(index)}
                            >
                                <div className={styles.addressLabel}>
                                    {option.label}
                                    {option.type === 'region' && (
                                        <span className={styles.addressType}> (région)</span>
                                    )}
                                    {option.type === 'departement' && (
                                        <span className={styles.addressType}> (département)</span>
                                    )}
                                    {option.type === 'municipality' && (
                                        <span className={styles.addressType}> (ville)</span>
                                    )}
                                </div>
                                {option.context && (
                                    <div className={styles.addressContext}>
                                        {option.context}
                                    </div>
                                )}
                            </div>
                        ))}

                        {!isLoading && suggestions.length === 0 && internalLabel && internalLabel.length >= 2 && internalLabel !== AROUND_ME && (
                            <div className={styles.addressOption}>
                                Aucun résultat
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressAutocomplete;