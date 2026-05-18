import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TextInput } from '@dataesr/react-dsfr';
import styles from './addNewPatient.cssmodule.scss';
import { addAutoSlashToDate, isValidBirthDate } from 'services/date';
import ErrorMessage from 'components/Forms/ErrorMessage';
import validateIneFormat from 'src/utils/validateIneFormat';
import Notification from 'components/Notification/Notification';
import { Button } from '@dataesr/react-dsfr';
import agent from 'services/agent';
import { useStore } from 'stores/index';

const AddNewPatient = () => {
  const {
    commonStore: { setNotification },
  } = useStore();
  const [birthDate, setBirthDate] = useState('');
  const [ine, setIne] = useState('');

  const [birthDateError, setBirthDateError] = useState('');
  const [ineError, setIneError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientAdded, setPatientAdded] = useState(false);

  useEffect(() => setIsSubmitting(false), [birthDate, ine]);

  const validateDateOfBirth = (value) => {
    if (value === '') {
      setBirthDateError('');
      return;
    }

    if (!isValidBirthDate(value)) {
      setBirthDateError("La date de naissance entrée n'est pas valide.");
      return;
    }
    setBirthDateError('');
  };

  const handleBirthDateChange = (e) => {
    const { value } = e.target;
    const formattedValue = addAutoSlashToDate(value);
    setBirthDate(formattedValue);
    validateDateOfBirth(formattedValue);
  };

  const validateINE = (value) => {
    if (value === '') {
      setIneError('');
      return;
    }

    const isValid = validateIneFormat(value);
    if (!isValid) {
      setIneError('INE invalide. Veuillez vérifier le format.');
    } else {
      setIneError('');
    }
  };

  const handleINEChange = (e) => {
    const { value } = e.target;
    const upperCaseValue = value.toUpperCase();
    setIne(upperCaseValue);
    validateINE(upperCaseValue);
  };

  const canAddPatient = useMemo(
    () => ine && birthDate && !ineError && !birthDateError && !isSubmitting,
    [ine, birthDate, ineError, birthDateError, isSubmitting],
  );

  const addPatient = async (e) => {
    e.preventDefault();
    setNotification(null);
    setIsSubmitting(true);
    try {
      await agent.Patient.create({
        ine,
        birthDate,
      });
      setPatientAdded(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fr-my-2w">
      {patientAdded ? (
        <Notification message="L'étudiant a bien été ajouté" type="success" />
      ) : (
        <form onSubmit={addPatient}>
          <TextInput
            className="midlength-input"
            data-test-id="etudiant-birth-date-input"
            label="Date de naissance"
            hint="Format JJ/MM/AAAA, par exemple : 25/01/1987"
            value={birthDate}
            type="text"
            onChange={handleBirthDateChange}
            pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
            placeholder="JJ/MM/AAAA"
            required
          />
          {birthDateError && (
            <ErrorMessage
              message={birthDateError}
              data-test-id="etudiant-birth-date-error"
            />
          )}
          <TextInput
            className={classNames(styles.ineInput, 'midlength-input')}
            data-test-id="etudiant-ine-input"
            label="Numéro INE de l'étudiant"
            hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant ou le certificat de scolarité."
            value={ine}
            onChange={handleINEChange}
            required
          />
          {ineError && (
            <ErrorMessage
              message={ineError}
              data-test-id="etudiant-ine-error"
            />
          )}
          <Notification type="info">
            <b>L&apos;INE : 11 chiffres ou lettres</b> présent sur le certificat
            de scolarité. Attention, il est différent du numéro étudiant, ou du
            numéro PIC de l&apos;université.
          </Notification>
          <Button
            submit
            id="app-patient-button"
            data-test-id="add-patient-button"
            icon="fr-fi-add-line"
            disabled={!canAddPatient}
          >
            Rechercher l'étudiant
          </Button>
        </form>
      )}
    </div>
  );
};

export default AddNewPatient;
