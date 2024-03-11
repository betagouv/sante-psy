import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, TextInput, Icon } from '@dataesr/react-dsfr';
import Page from 'components/Page/Page';
import agent from 'services/agent';
import classNames from 'classnames';
import styles from './studentEligibility.cssmodule.scss';

const StudentEligibility = () => {
  const [INE, setINE] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showEligibility, setShowEligibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = e => {
    e.preventDefault();
    setIsLoading(true);
    agent.Eligibility.get({ ine: INE }).then(response => {
      setIsEligible(response);
      setShowEligibility(true);
      setIsLoading(false);
    }).catch(err => {
      if (err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
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
  };

  const eligibilityMessage = () => {
    if (isEligible) {
      return (
        <div className={classNames(styles.eligibilityMessage, styles.eligibilityMessage_valid)}>
          <Icon
            name="ri-checkbox-circle-fill"
            size="lg"
            color="#18753c"
            iconPosition="left"
          >
            <p>Vous êtes éligible au dispositif</p>
          </Icon>

        </div>
      );
    }
    return (
      <div className={classNames(styles.eligibilityMessage, styles.eligibilityMessage_error)}>
        <Icon
          name="ri-close-circle-fill"
          size="lg"
          color="#ce0500"
          iconPosition="left"
          >
          <p>Numéro INE inconnu ou non éligible au dispositif</p>
        </Icon>
        <ul>
          <li>Contactez le service de santé de votre établissement.</li>
          <li>
            Consultez
            {' '}
            <Link to="/faq">la Foire aux questions</Link>
            <Icon name="ri-arrow-right-circle-fill" size="lg" iconPosition="right" />
          </li>
          <li>
            Ou
            {' '}
            <Link state={{ ine: INE }} to="/eligibilite/contact">contactez-nous pour vérifier votre éligibilité</Link>
            <Icon name="ri-arrow-right-circle-fill" size="lg" iconPosition="right" />
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Page
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      currentBreadCrumb="Éligibilité"
      title={(
        <>
          Éligibilité
        </>
      )}
      description={(
        <>
          Vous êtes étudiant, et vous souhaitez prendre part au dispositif ? Vérifier que vous êtes éligible
        </>
      )}
      className={styles.page}
    >
      <h2 className={styles.title}>
        Condition d&apos;éligibilité
      </h2>
      <p>
        Le dispositif Santé Psy Étudiant est accessible à tous les étudiants inscrits dans un établissement d&apos;enseignement supérieur reconnu par
        le Ministère de l&apos;Enseignement supérieur et de la Recherche (ou un ministère en lien avec celui-ci)
      </p>
      <p>
        Il concerne tout type d&apos;établissement qu&apos;il soit public ou privé, quel que soit le lieu de scolarité, le statut de l&apos;école / université
        ou bien encore le lieu de résidence de l&apos;étudiant.
      </p>

      <form onSubmit={submit}>
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
              onChange={e => onChange(e.target.value)}
            />
            <Button data-test-id="check-ine-button" disabled={isLoading} submit>Vérifier</Button>
          </div>
          {showEligibility && <span className={styles.text}>{eligibilityMessage()}</span>}
        </div>
      </form>
    </Page>
  );
};

export default observer(StudentEligibility);
