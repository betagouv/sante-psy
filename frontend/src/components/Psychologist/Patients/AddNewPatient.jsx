import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { addAutoSlashToDate, isValidBirthDate } from 'services/date';
import ErrorMessage from 'components/Forms/ErrorMessage';
import validateIneFormat from 'src/utils/validateIneFormat';
import agent from 'services/agent';
import { useStore } from 'stores/index';
import InviteStudent from './InviteStudent';
import ConfirmNewPatient from './ConfirmNewPatient';
import { Stack } from 'components/Utils/Stack';

const AddNewPatient = () => {
  const {
    commonStore: { setNotification },
  } = useStore();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ine, setIne] = useState('');

  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [ineError, setIneError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [foundStudent, setFoundStudent] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const [didNotFindStudent, setDidNotFindStudent] = useState(false);
  const [alreadyAPatient, setAlreadyAPatient] = useState(false);

  useEffect(() => {
    setIsSubmitting(false);
    setDidNotFindStudent(false);
    setAlreadyAPatient(false);
  }, [dateOfBirth, ine]);

  const validateDateOfBirth = (value) => {
    if (value === '') {
      setDateOfBirthError('');
      return;
    }

    if (!isValidBirthDate(value)) {
      setDateOfBirthError("La date de naissance entrée n'est pas valide.");
      return;
    }
    setDateOfBirthError('');
  };

  const handleDateOfBirthChange = (e) => {
    const { value } = e.target;
    const formattedValue = addAutoSlashToDate(value);
    setDateOfBirth(formattedValue);
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

  const canFindStudent = useMemo(
    () => ine && dateOfBirth && !ineError && !dateOfBirthError && !isSubmitting,
    [ine, dateOfBirth, ineError, dateOfBirthError, isSubmitting],
  );

  const inviteStudent = useMemo(() => tryCount >= 3, [tryCount]);

  const cancelInvite = () => {
    setDateOfBirth('');
    setIne('');
    setTryCount(0);
  };

  const findStudent = async (e) => {
    e.preventDefault();
    setNotification(null);
    setIsSubmitting(true);
    try {
      const res = await agent.Psychologist.findStudent({
        ine,
        dateOfBirth,
      });
      if (res.student) {
        setFoundStudent(res.student);
        return;
      }
      if (!res.studentExists) {
        onDidNotFindStudent();
        return;
      }
      setAlreadyAPatient(true);
    } catch (err) {
      console.error(err);
    }
  };

  const onCancelConfirmStudent = () => {
    setIne('');
    setDateOfBirth('');
    setFoundStudent(null);
  };

  const onDidNotFindStudent = () => {
    setTryCount((prevCount) => setTryCount(prevCount + 1));
    setDidNotFindStudent(true);
  };

  return (
    <div className="fr-my-2w">
      <Stack>
        {inviteStudent ? (
          <InviteStudent cancelInvite={cancelInvite} />
        ) : foundStudent ? (
          <ConfirmNewPatient
            foundStudent={foundStudent}
            onCancel={onCancelConfirmStudent}
          />
        ) : (
          <>
            <form onSubmit={findStudent}>
              <Input
                className="midlength-input"
                label="Date de naissance"
                hintText="Format JJ/MM/AAAA, par exemple : 25/01/1987"
                nativeInputProps={{
                  'data-test-id': 'etudiant-birth-date-input',
                  value: dateOfBirth,
                  type: 'text',
                  onChange: handleDateOfBirthChange,
                  pattern:
                    '^([0-2][0-9]|(3)[0-1])(\\/)(((0)[0-9])|((1)[0-2]))(\\/)\\d{4}$',
                  placeholder: 'JJ/MM/AAAA',
                  required: true,
                }}
              />

              {dateOfBirthError && (
                <ErrorMessage
                  message={dateOfBirthError}
                  data-test-id="etudiant-birth-date-error"
                />
              )}
              <Input
                className="midlength-input"
                label="Numéro INE de l'étudiant"
                hintText={
                  <>
                    <b>11 chiffres ou lettres</b> présent sur le certificat de
                    scolarité. Attention, il est différent du numéro étudiant,
                    ou du numéro PIC de l&apos;université.
                  </>
                }
                nativeInputProps={{
                  'data-test-id': 'etudiant-ine-input',
                  value: ine,
                  onChange: handleINEChange,
                  required: true,
                }}
              />
              {ineError && (
                <ErrorMessage
                  message={ineError}
                  data-test-id="etudiant-ine-error"
                />
              )}
              <Button
                nativeButtonProps={{ type: 'submit' }}
                id="app-patient-button"
                data-test-id="add-patient-button"
                iconId="fr-fi-add-line"
                disabled={!canFindStudent}
              >
                Rechercher l'étudiant
              </Button>
            </form>
            {didNotFindStudent && (
              <Alert
                severity="warning"
                title=""
                description="Cet étudiant n'existe pas ou bien n'a pas créé son compte"
              />
            )}
            {alreadyAPatient && (
              <Alert
                severity="success"
                title=""
                description="Cet étudiant est déja un de vos patients"
              />
            )}
          </>
        )}
      </Stack>
    </div>
  );
};

export default AddNewPatient;
