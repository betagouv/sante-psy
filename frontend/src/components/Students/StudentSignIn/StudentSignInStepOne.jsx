import React, { useEffect, useState } from 'react';
import agent from 'services/agent';
import styles from './studentSignIn.cssmodule.scss';
import StudentSignInHeader from './StudentSignInHeader';
import { validateEmailField } from 'src/utils/validateEmailFormat';

const StudentSignInStepOne = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [notification, setNotification] = useState(null);
  const [canSendEmail, setCanSendEmail] = useState(true);

  useEffect(() => setCanSendEmail(!!email), [email]);

  const sendStudentSecondStepMail = async (e) => {
    setCanSendEmail(false);
    e.preventDefault();
    const isValid = validateEmailField(email, setEmailError);
    if (!isValid) return;

    try {
      setCanSendEmail(false);
      const response = await agent.Student.sendStudentSecondStepMail(email);
      setNotification({ type: 'success', message: response.message });
    } catch (error) {
      setNotification({
        type: 'error',
        message: "Une erreur est survenue lors de l'inscription.",
      });
    }
  };

  return (
    <StudentSignInHeader description="Ton identifiant sera ton email">
      <form onSubmit={sendStudentSecondStepMail}>
        {notification && (
          <div
            className={`fr-alert fr-alert--${notification.type} fr-mt-3w`}
            role="alert"
          >
            <h3 className="fr-alert__title">{notification.message}</h3>
            {notification.type === 'success' && (
              <p>
                Un email de validation vient de t&apos;être envoyé si ton
                adresse email est correcte et n&apos;a pas déjà été utilisée
                pour un autre compte.
                <br />
                Si tu suspectes une usurpation ou une erreur, tu peux nous
                contacter via le{' '}
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
              Ton email
            </label>
            <input
              className={`fr-input ${emailError ? 'fr-input--error' : ''}`}
              id="email-input"
              type="email"
              placeholder="Ton email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              onBlur={() => validateEmailField(email, setEmailError)}
              required
            />
            {emailError && <p className="fr-error-text">{emailError}</p>}
          </div>
        </div>

        <div className="fr-my-4w">
          <button className="fr-btn" type="submit" disabled={!canSendEmail}>
            Suivant
          </button>
        </div>
      </form>
    </StudentSignInHeader>
  );
};

export default StudentSignInStepOne;
