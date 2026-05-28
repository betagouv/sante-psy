import React, { useMemo, useState } from 'react';
import styles from './confirmNewPatient.cssmodule.scss';
import agent from 'services/agent';
import { Checkbox } from '@dataesr/react-dsfr';
import { ButtonGroup } from '@dataesr/react-dsfr';
import { Button } from '@dataesr/react-dsfr';
import { Alert } from '@dataesr/react-dsfr';
import { HashLink } from 'react-router-hash-link';
import { Icon } from '@dataesr/react-dsfr';
import { Stack } from 'components/Utils/Stack';

const getStudentData = (student) => [
  {
    key: 'lastname',
    title: 'Nom',
    value: student.lastName,
  },
  {
    key: 'firstname',
    title: 'Nom',
    value: student.firstNames,
  },
  {
    key: 'ine',
    title: 'INE',
    value: student.ine,
  },

  {
    key: 'birthDate',
    title: 'Date de naissance',
    value: new Date(student.dateOfBirth).toLocaleDateString('fr-FR'),
  },
  {
    key: 'schoolname',
    title: 'Établissement',
    value: student.schoolName,
  },
];

const ConfirmNewPatient = ({ foundStudent, onCancel }) => {
  const [checkCertifIdentity, setCheckCertifIdentity] = useState(false);
  const [checkCertifValidity, setCheckCertifValidity] = useState(false);

  const [addedPatient, setAddedPatient] = useState(null);

  const canConfirmPatient = useMemo(
    () => checkCertifIdentity && checkCertifValidity,
    [checkCertifIdentity, checkCertifValidity],
  );

  const addPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await agent.Patient.create({
        studentId: foundStudent.id,
      });
      if (res.newPatient) {
        setAddedPatient(res.newPatient);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayStudentInfo = (student) => (
    <div>
      {getStudentData(student).map(({ key, title, value }) => (
        <div key={key} className={styles.infoRow}>
          <span className={styles.infoTitle}>{title}</span>
          <span className={styles.infoValue}>{value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <h3>Informations de l'étudiant</h3>
      {displayStudentInfo(foundStudent)}
      {!addedPatient && (
        <form onSubmit={addPatient}>
          <Stack>
            <div>
              <Checkbox
                label="J'ai bien comparé l'identité de l'étudiant avec le certificat de scolarité"
                onChange={(e) => setCheckCertifIdentity(e.target.checked)}
                checked={checkCertifIdentity}
              />
              <Checkbox
                label="J'ai vérifié que le certificat de scolarité est valable sur la période en cours"
                onChange={(e) => setCheckCertifValidity(e.target.checked)}
                checked={checkCertifValidity}
              />
            </div>
            <ButtonGroup isInlineFrom="xs">
              <Button secondary onClick={onCancel}>
                Annuler
              </Button>
              <Button disabled={!canConfirmPatient} submit>
                Confirmer
              </Button>
            </ButtonGroup>
          </Stack>
        </form>
      )}
      {addedPatient && (
        <>
          <Alert
            type="success"
            description="Vous pouvez dès à présent déclarer des séances pour cet étudiant"
            title="Étudiant ajouté"
          />
          <ButtonGroup isInlineFrom="xs">
            <HashLink
              to="/psychologue/nouvelle-seance"
              state={{ patientId: addedPatient.id }}
              className="fr-btn"
            >
              <div>
                <Icon name="ri-add-line" />
                Nouvelle séance
              </div>
            </HashLink>
            <HashLink
              to={`/psychologue/etudiant/${addedPatient.id}`}
              className="fr-btn"
            >
              <div>Voir le dossier</div>
            </HashLink>
          </ButtonGroup>
        </>
      )}
    </>
  );
};

export default ConfirmNewPatient;
