import React, { useState, useEffect } from 'react';
import { TextInput, RadioGroup, Radio, Icon, Checkbox } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import { addAutoSlashToDate } from 'services/date';
import Notification from 'components/Notification/Notification';
import { HashLink } from 'react-router-hash-link';
import styles from './addEditPatient.cssmodule.scss';

// TODO si date de naissance invalide, pas possible de cliquer
// TODO ajouter env à staging et prod
// TODO tester lib codegouv pour component ?

const PatientInfo = ({ patient, changePatient }) => {
  const [ineError, setIneError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');

  const validateINE = value => {
    const patterns = [
      /^[0-9]{9}[A-HJK]{2}$/, // INE-RNIE
      /^\d{10}[A-HJ-NPR-Z]$/, // INE-BEA
      /^[0-9A-Z]{10}\d$/, // INE-Base 36
      /^\d{4}[A]\d{5}[A-HJ-NPR-Z]$/, // INE-SIFA
    ];

    const isValid = patterns.some(pattern => pattern.test(value));

    if (!isValid) {
      setIneError('INE invalide. Veuillez vérifier le format.');
    } else {
      setIneError('');
    }
  };

  const handleINEChange = e => {
    const { value } = e.target;
    changePatient(value, 'INE');
    validateINE(value);
  };

  const validateDateOfBirth = value => {
    const pattern = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!pattern.test(value)) {
      setDateOfBirthError('Le format de la date doit être JJ/MM/AAAA.');
      return false;
    }

    const [day, month, year] = value.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const maxBirthDate = new Date(currentDate.getFullYear() - 15, currentDate.getMonth(), currentDate.getDate());

    if (birthDate > maxBirthDate) {
      setDateOfBirthError('La date de naissance entrée n\'est pas valide.');
      return false;
    }
    setDateOfBirthError('');
    return true;
  };

  const handleDateOfBirthChange = e => {
    const { value } = e.target;
    const formattedValue = addAutoSlashToDate(value);
    changePatient(formattedValue, 'dateOfBirth');
    validateDateOfBirth(formattedValue);
  };

  useEffect(() => {
    if (patient.INE) {
      validateINE(patient.INE);
    }
  }, [patient.INE]);

  useEffect(() => {
    if (patient.dateOfBirth) {
      validateDateOfBirth(patient.dateOfBirth);
    }
  }, [patient.dateOfBirth]);

  return (
    <>
      <TextInput
        className="midlength-input fr-mt-3w"
        data-test-id="etudiant-first-name-input"
        label="Prénoms"
        value={patient.firstNames}
        onChange={e => changePatient(e.target.value, 'firstNames')}
        required
      />
      <TextInput
        className="midlength-input"
        data-test-id="etudiant-last-name-input"
        label="Nom"
        value={patient.lastName}
        onChange={e => changePatient(e.target.value, 'lastName')}
        required
      />
      <RadioGroup
        name="gender"
        legend="Genre"
        value={patient.gender}
        onChange={value => changePatient(value, 'gender')}
        required
        isInline
      >
        <Radio
          data-test-id="etudiant-gender-female-input"
          label="Femme"
          value="female"
        />
        <Radio
          label="Homme"
          value="male"
        />
        <Radio
          value="other"
          label={(
            <span className={styles.tooltipGender}>
              Autre
              <span title="Si l'étudiant s'interroge sur son genre, indiquer celui auquel il s'identifie">
                <Icon
                  name="ri-information-line"
                  color="#000091"
                  size="lg"
                />
              </span>
            </span>
          )}
        />
      </RadioGroup>
      <TextInput
        className="midlength-input"
        data-test-id="etudiant-birth-date-input"
        label="Date de naissance"
        hint="Format JJ/MM/AAAA, par exemple : 25/01/1987"
        value={patient.dateOfBirth}
        type="text"
        onChange={handleDateOfBirthChange}
        pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
        placeholder="JJ/MM/AAAA"
        required
      />
      {dateOfBirthError && <p className={styles.errorMessage}>{dateOfBirthError}</p>}
      <TextInput
        className={classNames(styles.ineInput, 'midlength-input')}
        data-test-id="etudiant-ine-input"
        label="Numéro INE de l'étudiant"
        hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant ou le certificat de scolarité."
        value={patient.INE}
        onChange={handleINEChange}
        required
      />
      {ineError && (
        <>
          <p className={styles.errorMessage}>{ineError}</p>
          <Notification type="info">
            <b>L&apos;INE : 11 chiffres ou lettres</b>
            {' '}
            présent sur le certificat de scolarité. Attention, il est différent du numéro étudiant, ou du numéro PIC de l&apos;université.
            {' '}
            <HashLink to="/eligibilite">Aussi, assurez-vous de l&apos;éligibilité de l&apos;étudiant</HashLink>
          </Notification>
        </>
      )}
      <Checkbox
        className="fr-input-group"
        data-test-id="etudiant-status-input"
        defaultChecked={patient.isStudentStatusVerified}
        label="J'ai bien vérifié le statut étudiant"
        hint="J'ai vu sa carte d'étudiant ou un autre justificatif"
        value="isStudentStatusVerified"
        onChange={e => changePatient(e.target.checked, 'isStudentStatusVerified')}
      />
      <TextInput
        className="midlength-input"
        data-test-id="etudiant-school-input"
        label="Établissement scolaire de l'étudiant"
        hint="Exemple : Université de Rennes ou ENSAE"
        value={patient.institutionName}
        onChange={e => changePatient(e.target.value, 'institutionName')}
      />
      <TextInput
        className="midlength-input"
        data-test-id="etudiant-doctor-name-input"
        label="Nom, prénom du médecin (optionnel)"
        hint="Exemple : Annie Benahmou"
        value={patient.doctorName}
        onChange={e => changePatient(e.target.value, 'doctorName')}
      />
    </>
  );
};

export default PatientInfo;
