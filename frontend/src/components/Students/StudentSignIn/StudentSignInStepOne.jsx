import React, { useState } from 'react';
import Page from 'components/Page/Page';
import agent from 'services/agent';
import validateEmailFormat from 'src/utils/validateEmailFormat';
import styles from './studentSignIn.cssmodule.scss';

const StudentSignInStepOne = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [notification, setNotification] = useState(null);

  const validateEmail = value => {
    const isValidEmail = validateEmailFormat(value);
    if (!isValidEmail) {
      setEmailError("Format incorrect de l'email.");
      return false;
    }
    setEmailError('');
    return true;
  };

  const sendStudentSecondStepMail = async e => {
    e.preventDefault();
    const isValid = validateEmail(email);
    if (!isValid) return;

    try {
      const response = await agent.Student.sendStudentSecondStepMail(email);
      setNotification({ type: 'success', message: response.message });
    } catch (error) {
      setNotification({ type: 'error', message: "Une erreur est survenue lors de l'inscription." });
    }
  };

  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title={(
        <>
          Inscription à votre
          {' '}
          <b>Espace Étudiant</b>
        </>
      )}
      description="Votre identifiant sera votre email"
    >
      <form onSubmit={sendStudentSecondStepMail}>
        {notification && (
          <div
            className={`fr-alert fr-alert--${notification.type} fr-mt-3w`}
            role="alert"
          >
            <h3 className="fr-alert__title">{notification.message}</h3>
            {notification.type === 'success' && (
            <p>
              Un mail de validation vient de vous être envoyé si votre adresse e-mail est correcte et n&apos;a pas déjà été utilisée
              pour un autre compte.
              <br />
              Si vous suspectez une usurpation ou une erreur, vous pouvez nous contacter via le
              {' '}
              <a
                href="https://santepsy.etudiant.gouv.fr/contact/formulaire"
                className="fr-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                formulaire de contact
              </a>
              .
            </p>
            )}
          </div>
        )}
        <div className="fr-my-2w">
          <div className="fr-input-group">
            <label
              className={`fr-label ${emailError ? styles.labelError : ''}`}
              htmlFor="email-input"
            >
              Votre e-mail
            </label>
            <span className="fr-hint-text">
              Nécessaire pour créer un compte. Nous ne la transmettrons qu&apos;aux psychologues avec qui
              vous prendrez rendez-vous.
            </span>
            <input
              className={`fr-input ${emailError ? 'fr-input--error' : ''}`}
              id="email-input"
              type="email"
              placeholder="Votre e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              required
            />
            {emailError && <p className="fr-error-text">{emailError}</p>}
          </div>
        </div>

        <div className="fr-my-4w">
          <button className="fr-btn" type="submit">
            Suivant
          </button>
        </div>
      </form>
    </Page>
  );
};

export default StudentSignInStepOne;
