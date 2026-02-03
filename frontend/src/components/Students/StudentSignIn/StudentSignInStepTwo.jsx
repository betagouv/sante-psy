import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from 'components/Page/Page';
import agent from 'services/agent';
import validateIneFormat from 'src/utils/validateIneFormat';
import validateNameFormat from 'src/utils/validateNameFormat';
import { addAutoSlashToDate, isValidBirthDate } from 'services/date';
import styles from './studentSignIn.cssmodule.scss';

const StudentSignInStepTwo = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [firstNames, setFirstNames] = useState('');
  const [firstNamesError, setFirstNamesError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [ine, setIne] = useState('');
  const [ineError, setIneError] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/inscription');
      return;
    }

    const verify = async () => {
      try {
        const response = await agent.Student.verifyStudentToken(token);
        setEmail(response.email);
        setValid(true);
      } catch {
        navigate('/inscription');
      }
    };
    verify();
  }, [token]);

  if (!valid) return null;

  const validateFirstNames = value => {
    if (!validateNameFormat(value)) {
      setFirstNamesError('Format incorrect du prénom.');
      return false;
    }
    setFirstNamesError('');
    return true;
  };

  const validateLastName = value => {
    if (!validateNameFormat(value)) {
      setLastNameError('Format incorrect du nom.');
      return false;
    }
    setLastNameError('');
    return true;
  };

  const validateDateOfBirth = value => {
    if (!value) {
      setDateOfBirthError('Date de naissance requise.');
      return false;
    }
    if (!isValidBirthDate(value)) {
      setDateOfBirthError("La date de naissance entrée n'est pas valide.");
    }
    setDateOfBirthError('');
    return true;
  };

  const handleDateOfBirthChange = e => {
    const { value } = e.target;
    const formattedValue = addAutoSlashToDate(value);
    setDateOfBirth(formattedValue);
    validateDateOfBirth(formattedValue);
  };

  const validateINE = value => {
    if (!validateIneFormat(value)) {
      setIneError('Format incorrect du numéro INE.');
      return false;
    }
    setIneError('');
    return true;
  };

  const signIn = async e => {
    e.preventDefault();

    const isValid = validateFirstNames(firstNames)
      && validateLastName(lastName)
      && validateDateOfBirth(dateOfBirth)
      && validateINE(ine);

    if (!isValid) return;

    try {
      await agent.Student.signIn({
        firstNames,
        lastName,
        dateOfBirth,
        ine,
        email,
      });
      navigate('/');
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error?.response?.status === 'conflict'
            ? 'Cet email ou numéro INE est déjà utilisé.'
            : 'Une erreur est survenue.',
      });
    }
  };

  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title={(
        <>
          Inscription à ton
          {' '}
          <b>Espace Étudiant</b>
        </>
      )}
      description="Dernière étape !"
    >
      <form onSubmit={signIn}>
        <div className="fr-my-2w">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="first-names-input">
              Prénom(s)
            </label>
            <input
              className={`fr-input midlength-input ${firstNamesError ? 'fr-input--error' : ''}`}
              id="first-names-input"
              type="text"
              value={firstNames}
              onChange={e => setFirstNames(e.target.value)}
              onBlur={() => validateFirstNames(firstNames)}
              required
            />
            {firstNamesError && <p className="fr-error-text">{firstNamesError}</p>}
          </div>

          <div className="fr-input-group">
            <label className="fr-label" htmlFor="last-name-input">
              Nom
            </label>
            <input
              className={`fr-input midlength-input ${lastNameError ? 'fr-input--error' : ''}`}
              id="last-name-input"
              value={lastName}
              type="text"
              onChange={e => setLastName(e.target.value)}
              onBlur={() => validateLastName(lastName)}
              required
            />
            {lastNameError && <p className="fr-error-text">{lastNameError}</p>}
          </div>

          <div className="fr-input-group">
            <label className="fr-label" htmlFor="dob-input">
              Date de naissance
            </label>
            <input
              className={`fr-input midlength-input ${dateOfBirthError ? 'fr-input--error' : ''}`}
              id="dateBirth-input"
              type="text"
              value={dateOfBirth}
              onChange={handleDateOfBirthChange}
              onBlur={() => validateDateOfBirth(dateOfBirth)}
              placeholder="JJ/MM/AAAA"
              required
            />
            {dateOfBirthError && <p className="fr-error-text">{dateOfBirthError}</p>}
          </div>

          <div className="fr-input-group">
            <label
              className={`fr-label ${ineError ? styles.labelError : ''}`}
              htmlFor="ine-input"
            >
              Numéro INE
              <span className="fr-hint-text">
                11 chiffres ou lettres, présent sur ton certificat de scolarité ou attestation CVEC
              </span>
            </label>
            <input
              className={`fr-input midlength-input ${ineError ? 'fr-input--error' : ''}`}
              id="ine-input"
              type="text"
              value={ine}
              onChange={e => setIne(e.target.value)}
              onBlur={() => validateINE(ine)}
              required
            />
            {ineError && <p className="fr-error-text">{ineError}</p>}
          </div>
        </div>

        {notification && (
          <div
            className={`fr-alert fr-alert--${notification.type} fr-mt-3w`}
            role="alert"
          >
            <h3 className="fr-alert__title">{notification.message}</h3>
            <p>
              Vérifie que ton INE et ton adresse email sont corrects et n&apos;ont pas déjà été utilisés
              pour un autre compte.
              <br />
              Si tu suspectes une usurpation ou une erreur, tu peux nous contacter via le
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
          </div>
        )}

        <div className="fr-my-4w">
          <button className="fr-btn" type="submit">
            Accéder à mon espace
          </button>
        </div>
      </form>
    </Page>
  );
};

export default StudentSignInStepTwo;
