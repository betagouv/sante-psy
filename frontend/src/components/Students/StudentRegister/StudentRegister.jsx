import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@gouvfr/dsfr/dist/utility/utility.min.css';
import '@gouvfr/dsfr/dist/component/input/input.min.css';
import Page from 'components/Page/Page';
import { validateIneFormat } from 'src/utils/validateIneFormat';
import agent from 'services/agent';
import { useStore } from 'stores/index';
import styles from './studentRegister.cssmodule.scss';
import { validateEmailFormat } from 'src/utils/validateEmailFormat';

const StudentRegister = () => {
  const [firstNames, setFirstNames] = useState('');
  const [ine, setIne] = useState('');
  const [email, setEmail] = useState('');
  const [ineError, setIneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();
  const { commonStore: { setNotification } } = useStore();

  const validateINE = (value) => {
    const isValidIne = validateIneFormat(value);
    if (!isValidIne) {
      setIneError('Format incorrect du numéro INE.');
      return false;
    }
    setIneError('');
    return true;
  };

  const validateEmail = (value) => {
    const isValidEmail = validateEmailFormat(value);
    if (!isValidEmail) {
      setEmailError("Format incorrect de l'email.");
      return false;
    }
    setEmailError('');
    return true;
  };

  const registerStudent = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const isValid = validateINE(ine) && validateEmail(email);
    if (!isValid) return;

    try {
      const response = await agent.Student.signIn({ firstNames, ine, email });
      const status = response?.status;

      if (status === 201 || status === 200) {
        setNotification({ type: 'success', message: response.data?.message });
        navigate('/inscription/validation');
      }
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 409) {
        setFormError(message || 'Cet email ou numéro INE est déjà utilisé.');
      } else {
        setNotification({
          type: 'error',
          message: message || 'Une erreur est survenue.',
        });
      }
    }
  };

  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title={
        <>
          Inscription à votre <b>Espace Étudiant</b>
        </>
      }
      description="Quelques infos sur vous"
    >
      <form onSubmit={registerStudent}>
        <div className="fr-my-2w">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="first-names-input">
              Prénom(s)
            </label>
            <input
              className="fr-input midlength-input"
              id="first-names-input"
              type="text"
              value={firstNames}
              onChange={(e) => setFirstNames(e.target.value)}
              required
            />
          </div>

          <div className="fr-input-group">
            <label
              className={`fr-label ${ineError ? styles.labelError : ''}`}
              htmlFor="ine-input"
            >
              Numéro INE de l'étudiant
              <span className="fr-hint-text">
                Il fait 11 caractères (chiffres et lettres). Vous pouvez le trouver sur votre carte d'étudiant
                ou votre certificat de scolarité.
              </span>
            </label>
            <input
              className={`fr-input midlength-input ${ineError ? 'fr-input--error' : ''}`}
              id="ine-input"
              type="text"
              value={ine}
              onChange={(e) => setIne(e.target.value)}
              onBlur={() => validateINE(ine)}
              required
            />
            {ineError && <p className="fr-error-text">{ineError}</p>}
          </div>

          <div className="fr-input-group">
            <label
              className={`fr-label ${emailError ? styles.labelError : ''}`}
              htmlFor="email-input"
            >
              Votre e-mail
            </label>
            <span className="fr-hint-text">
              Nécessaire pour créer un compte. Nous ne la transmettrons qu'aux psychologues avec qui
              vous prendrez rendez-vous.
            </span>
            <input
              className={`fr-input ${emailError ? 'fr-input--error' : ''}`}
              id="email-input"
              type="email"
              placeholder="Votre e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        {formError && (
          <div className="fr-alert fr-alert--error fr-mt-2w" role="alert">
            <p>{formError}</p>
          </div>
        )}
      </form>
    </Page>
  );
};

export default StudentRegister;
