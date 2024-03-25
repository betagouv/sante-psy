import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextInput, Button } from '@dataesr/react-dsfr';
import agent from 'services/agent';
import styles from './studentEligibility.cssmodule.scss';

const StudentEligibilityInput = ({ showValidationButton, eligibilityMessage, onINEChange, callback }) => {
  const [INE, setINE] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showEligibility, setShowEligibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitINE = e => {
    if (e) {
      e.preventDefault();
    }

    setIsLoading(true);
    agent.Eligibility.get({ ine: INE }).then(async response => {
      if (callback) {
        await callback(INE);
      }
      setIsEligible(response);
      setShowEligibility(true);
      setIsLoading(false);
    }).catch(error => {
      if (error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        setError(true);
      }
      setIsLoading(false);
    });
  };

  const onChange = ine => {
    setError(false);
    setErrorMessage('');
    setShowEligibility(false);
    setIsEligible(false);
    setINE(ine);
    setIsLoading(false);

    if (onINEChange) {
      onINEChange(ine);
    }
  };

  useEffect(() => {
    if (INE.length === 11 && !showValidationButton) {
      submitINE();
    }
  }, [INE]);

  const onBlur = e => {
    e.preventDefault();
    if (INE.length === 11 && !showValidationButton) {
      submitINE();
    }
  };

  return (
    <div className={styles.formContainer}>
      <div>
        <TextInput
          className={styles.input}
          data-test-id="ine-input"
          label="Numéro INE"
          value={INE}
          hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant."
          messageType={error ? 'error' : ''}
          message={errorMessage}
          onBlur={onBlur}
          onChange={e => onChange(e.target.value)}
        />
        {
          showValidationButton && <Button data-test-id="check-ine-button" disabled={isLoading} onClick={e => submitINE(e)}>Vérifier</Button>
        }

      </div>
      {showEligibility && <span className={styles.text}>{eligibilityMessage(isEligible)}</span>}
    </div>
  );
};

export default observer(StudentEligibilityInput);
