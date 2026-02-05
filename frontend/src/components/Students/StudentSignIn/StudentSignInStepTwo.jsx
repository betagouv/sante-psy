import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Alert } from '@dataesr/react-dsfr';
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
  const [hasTriedOnce, setHasTriedOnce] = useState(false);
  const [ineValidationError, setIneValidationError] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [certificateSent, setCertificateSent] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);

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

  if (signInSuccess) {
    return (
      <Page
        withStats
        breadCrumbs={[{ href: '/', label: 'Accueil' }]}
        title="Inscription validée"
    >
        <div className="fr-alert fr-alert--success fr-mb-3w">
          <h3 className="fr-alert__title">
            Ton inscription a bien été validée !
          </h3>
          <p>
            Tu as reçu un email de connexion pour accéder à ton Espace Étudiant.
            <br />
            Pense à vérifier tes spams si tu ne le vois pas tout de suite.
          </p>
        </div>

        <div className="fr-mt-3w">
          <Button onClick={() => navigate('/')}>
            Accéder à l&apos;accueil
          </Button>
        </div>
      </Page>
    );
  }

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
      return false;
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

  const handleSendCertificate = async e => {
    e.preventDefault();

    if (!file) {
      setFileError('Merci de joindre un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ine', ine);
    formData.append('firstNames', firstNames);
    formData.append('lastName', lastName);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('token', token);

    try {
      await agent.Student.sendCertificate(formData);
      setCertificateSent(true);
    } catch (err) {
      setFileError("Erreur lors de l'envoi du certificat. Merci de réessayer.");
    }
  };

  const signIn = async e => {
    e.preventDefault();

    const isValid = validateFirstNames(firstNames)
      && validateLastName(lastName)
      && validateDateOfBirth(dateOfBirth)
      && validateINE(ine);

    if (!isValid) return;

    setNotification(null);
    setIneValidationError(null);

    try {
      const response = await agent.Student.signIn({
        firstNames,
        lastName,
        dateOfBirth,
        ine,
        email,
        isRetry: hasTriedOnce,
      });

      if (response.success) {
        setSignInSuccess(true);
      }
    } catch (error) {
      if (error?.response?.data?.errorType === 'INE_NOT_FOUND') {
        setIneValidationError(error.response.data);
        setHasTriedOnce(true);
      } else {
        setNotification({
          type: 'error',
          message:
            error?.response?.data?.status === 'conflict'
              ? 'Cet email ou numéro INE est déjà utilisé.'
              : 'Une erreur est survenue.',
        });
      }
    }
  };

  if (certificateSent) {
    return (
      <Page
        withStats
        breadCrumbs={[{ href: '/', label: 'Accueil' }]}
        title="Certificat envoyé"
      >
        <div className="fr-alert fr-alert--success fr-mb-3w">
          <h3 className="fr-alert__title">Ton certificat de scolarité a bien été envoyé.</h3>
          <p>Tu as reçu un email de confirmation ainsi qu&apos;un lien de connexion à ton espace.</p>
        </div>
        <div className="fr-mt-3w">
          <Button onClick={() => navigate('/')}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </Page>
    );
  }

  if (ineValidationError && !ineValidationError.canRetry) {
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
        <div className="fr-alert fr-alert--warning fr-mb-3w">
          <h3 className="fr-alert__title">Étudiant non reconnu</h3>
          <p>{ineValidationError.message}</p>
        </div>

        <h2 className="fr-mt-3w">Nous envoyer ton certificat de scolarité</h2>
        <p>Merci de joindre une copie de ton certificat de scolarité de l&apos;année en cours :</p>

        {fileError && <Alert type="error" title="Erreur">{fileError}</Alert>}

        <div className="fr-my-2w">
          <label className="fr-label" htmlFor="file-upload">
            Ajouter un fichier (.jpg, .pdf, .png)
          </label>
          <input
            className="fr-input"
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            placeholder="Formats supportés : .jpg, .png, .pdf. Un seul fichier possible."
            onChange={e => setFile(e.target.files[0])}
          />
        </div>

        <div className="fr-mt-3w fr-btns-group fr-btns-group--inline-md">
          <Button onClick={handleSendCertificate} disabled={!file}>
            Envoyer mon certificat de scolarité
          </Button>
        </div>
      </Page>
    );
  }

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

        {ineValidationError && ineValidationError.canRetry && (
          <div className="fr-alert fr-alert--warning fr-mt-3w">
            <h3 className="fr-alert__title">Étudiant non reconnu</h3>
            <p>
              Vérifie que tu n&apos;as pas fait de faute de frappe dans ton numéro INE ou ta date de naissance et réessaye.
            </p>
          </div>
        )}

        <div className="fr-my-4w">
          <button className="fr-btn" type="submit">
            {hasTriedOnce ? 'Réessayer l\'inscription' : 'M\'inscrire'}
          </button>
        </div>
      </form>
    </Page>
  );
};

export default StudentSignInStepTwo;
