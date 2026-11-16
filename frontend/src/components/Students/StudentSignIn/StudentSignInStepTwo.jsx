import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import agent from 'services/agent';
import validateIneFormat from 'src/utils/validateIneFormat';
import validateNameFormat from 'src/utils/validateNameFormat';
import {
  addAutoSlashToDate,
  formatFrenchDateNoWeekday,
  isValidBirthDate,
} from 'services/date';
import { useStore } from 'stores/';
import styles from './studentSignIn.cssmodule.scss';
import StudentSignInHeader from './StudentSignInHeader';
import { TextInput } from 'components/Forms/TextInput';

const StudentSignInStepTwo = () => {
  const {
    commonStore: { config },
  } = useStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const [firstNames, setFirstNames] = useState('');
  const [firstNamesValid, setFirstNamesValid] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameValid, setLastNameValid] = useState(false);
  const [ine, setIne] = useState('');
  const [ineValid, setIneValid] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfBirthValid, setDateOfBirthValid] = useState(false);

  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const [valid, setValid] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/inscription');
      return;
    }

    const verify = async () => {
      try {
        const response = await agent.Student.verifyStudentToken(token);
        setEmail(response.email);
        if (response.signInAttempts >= config.maxSignInAttempts) {
          setIsBlocked(true);
        }
        setValid(true);
      } catch {
        navigate('/inscription');
      }
    };
    verify();
  }, [token]);

  if (!valid) return null;

  const canSubmitForm =
    firstNamesValid && lastNameValid && ineValid && dateOfBirthValid;

  const signIn = async (e) => {
    e.preventDefault();

    if (!canSubmitForm) return;

    setNotification(null);

    try {
      await agent.Student.signIn({
        firstNames,
        lastName,
        dateOfBirth,
        ine,
        email,
        dryRun: true,
      });

      navigate('/inscription/certificat', {
        state: {
          email,
          ine,
          firstNames,
          lastName,
          dateOfBirth,
          apiInesCheck: true,
        },
      });
    } catch (error) {
      const status = error?.response?.status;
      const errorData = error?.response?.data;

      if (status === 502) {
        // technical failure on INES side (timeout, network, auth, etc.)
        navigate('/inscription/certificat', {
          state: {
            email,
            ine,
            firstNames,
            lastName,
            dateOfBirth,
            apiInesCheck: null,
          },
        });
      } else if (errorData?.shouldSendCertificate) {
        navigate('/inscription/certificat', {
          state: {
            email,
            ine,
            firstNames,
            lastName,
            dateOfBirth,
            apiInesCheck: false,
          },
        });
      } else if (errorData?.shouldContact) {
        setIsBlocked(true);
      } else {
        setNotification({ type: 'error' });
      }
    }
  };

  const dateOfBirthStr = dateOfBirthValid
    ? formatFrenchDateNoWeekday(
        new Date(`${dateOfBirth.split('/').reverse().join('-')}T00:00:00`),
      )
    : '';

  return (
    <StudentSignInHeader>
      <div className={styles.privacyBanner}>
        <span className="fr-icon--sm fr-icon-eye-line" aria-hidden="true" />
        <p className={styles.privacyText}>
          Les informations suivantes seront visibles par les psychologues
        </p>
      </div>
      <form onSubmit={signIn}>
        <div className="fr-my-2w">
          <TextInput
            id="first-names"
            disabled={isBlocked}
            label="Prénom(s)"
            fieldName="prénom"
            setValid={setFirstNamesValid}
            setValue={setFirstNames}
            validator={validateNameFormat}
          />
          <TextInput
            id="last-name"
            disabled={isBlocked}
            fieldName="nom"
            label="Nom"
            setValid={setLastNameValid}
            setValue={setLastName}
            validator={validateNameFormat}
          />

          <TextInput
            id="date-of-birth"
            disabled={isBlocked}
            fieldName="date de naissance"
            label="Date de naissance"
            setValid={setDateOfBirthValid}
            setValue={setDateOfBirth}
            validator={isValidBirthDate}
            formatter={addAutoSlashToDate}
            placeholder="JJ/MM/AAAA"
            successMessage={
              dateOfBirthStr && (
                <>
                  Date de naissance : <b>{dateOfBirthStr}</b>. C'est bien ça ?
                </>
              )
            }
          />

          <TextInput
            id="ine"
            disabled={isBlocked}
            fieldName="numéro INE"
            label="Numéro INE"
            hint="11 chiffres ou lettres, présent sur ton certificat de scolarité
                ou attestation CVEC"
            setValid={setIneValid}
            setValue={setIne}
            validator={validateIneFormat}
            formatter={(s) => s.toUpperCase()}
          />
        </div>

        {(notification || isBlocked) && (
          <div className="fr-alert fr-alert--error fr-mt-3w" role="alert">
            <h3 className="fr-alert__title">
              Une erreur est survenue lors de l&apos;inscription.
            </h3>
            <p>
              Vérifie que toutes tes informations sont correctes / n&apos;ont
              pas déjà été utilisées, puis réessaye en réappuyant sur le bouton.
              <br />
              Si le problème persiste,{' '}
              <a
                href="https://santepsy.etudiant.gouv.fr/contact/formulaire"
                className="fr-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                nous contacter
              </a>
              .
            </p>
          </div>
        )}
        <div className="fr-mb-4w fr-mt-2w">
          <button
            className="fr-btn"
            type="submit"
            disabled={isBlocked || !canSubmitForm}
          >
            {notification?.type === 'error'
              ? 'Confirmer ces informations'
              : 'Continuer mon inscription'}
          </button>
        </div>
        <p>
          Une difficulté pour créer ton compte ?{' '}
          <a
            href="https://santepsy.etudiant.gouv.fr/contact/formulaire"
            className="fr-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contacte notre support
          </a>
          , on est là pour t&lsquo;aider.
        </p>
      </form>
    </StudentSignInHeader>
  );
};

export default StudentSignInStepTwo;
