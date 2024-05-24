import React, { useState } from 'react';
import { observer } from 'mobx-react';
import StepBanner from './StepBanner';
import styles from './studentEligibilityStepThree.cssmodule.scss';
import { Button, Icon, TextInput } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

const StudentEligibilityStepThree = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();
    setIsLoading(true);
    const searchPath = `?address=${address}`;
    navigate(`/trouver-un-psychologue${searchPath}`);
  };

  const handleChange = e => {
    setAddress(e.target.value)
  }

  return (
    <section aria-labelledby="step-banner-title">
      <StepBanner number={3} text="Trouver un psychologue" buttonIcon="ri-search-line" buttonText="Rechercher" buttonLink="/trouver-un-psychologue"/>
      <div className={styles.container}>
        <img src="/images/followup.svg" alt="image éligibilité" />
        <form onSubmit={submit}>
            <h2>J’indique ma ville, code postal, ou département</h2>
            <div className={styles.inputContainer}>
              <TextInput
                className={styles.input}
                data-test-id="search-psychologist-input"
                onChange={handleChange}
              />
              <Button icon="ri-arrow-right-line" data-test-id="search-psychologist-button" disabled={isLoading} secondary submit />
            </div>
        </form>
      </div>
    </section>
  );
};

export default observer(StudentEligibilityStepThree);
