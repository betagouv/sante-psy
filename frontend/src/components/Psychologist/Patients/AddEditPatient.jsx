import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextInput, Checkbox } from '@dataesr/react-dsfr';

import { useStore } from 'stores/';

import { formatDDMMYYYY } from 'services/date';
import agent from 'services/agent';

const AddEditPatient = () => {
  const navigate = useNavigate();
  const { commonStore: { config } } = useStore();
  const { patientId } = useParams();
  const [patient, setPatient] = useState();

  useEffect(() => {
    if (patientId) {
      agent.Patient.getOne(patientId).then(response => {
        setPatient({
          ...response,
          dateOfBirth: response.dateOfBirth
            ? formatDDMMYYYY(new Date(response.dateOfBirth))
            : '',
        });
      });
    } else {
      setPatient({
        INE: '',
        dateOfBirth: '',
        doctorAddress: '',
        doctorName: '',
        firstNames: '',
        hasPrescription: false,
        institutionName: '',
        isStudentStatusVerified: false,
        lastName: '',
      });
    }
  }, [patientId]);

  const changePatient = (value, field) => {
    setPatient({ ...patient, [field]: value });
  };

  const button = {
    icon: patientId ? 'fr-fi-check-line' : 'fr-fi-add-line',
    text: patientId ? 'Valider les modifications' : "Ajouter l'étudiant",
  };
  const save = e => {
    e.preventDefault();
    const action = patientId
      ? agent.Patient.update(patientId, patient)
      : agent.Patient.create(patient);
    action
      .then(response => {
        navigate('/psychologue/mes-etudiants', { state: { notification: response } });
      })
      .catch(() => window.scrollTo(0, 0));
  };

  return (
    <div className="fr-my-2w">
      <form onSubmit={save}>
        <p className="fr-text--sm fr-mb-1v">
          Les champs avec une astérisque (
          <span className="red-text">*</span>
          ) sont obligatoires.
        </p>
        <p className="fr-text--sm fr-mb-1v">
          S&lsquo;il vous manque des champs non-obligatoires,
          vous pourrez y revenir plus tard pour compléter le dossier.
        </p>
        {patient && (
        <>
          <div id="mandatory-informations">
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
            <TextInput
              className="midlength-input"
              label={`Date de naissance (obligatoire uniquement pour vos étudiants enregistrés après le
                ${config.dateOfBirthDeploymentDate}
                )`}
              hint="Format JJ/MM/AAAA, par exemple : 25/01/1987"
              value={patient.dateOfBirth}
              type="text"
              onChange={e => changePatient(e.target.value, 'dateOfBirth')}
              pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
              placeholder="JJ/MM/AAAA"
            />
          </div>
          <div id="other-informations">
            <TextInput
              className="midlength-input"
              label="Établissement scolaire de l'étudiant"
              hint="Exemple : Université de Rennes ou ENSAE"
              value={patient.institutionName}
              onChange={e => changePatient(e.target.value, 'institutionName')}
            />
            <TextInput
              className="midlength-input"
              data-test-id="etudiant-ine-input"
              label="Numéro INE de l'étudiant (optionnel)"
              hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant."
              value={patient.INE}
              pattern="^[a-zA-Z0-9]{1,11}$"
              onChange={e => changePatient(e.target.value, 'INE')}
            />
            <Checkbox
              className="fr-input-group"
              defaultChecked={patient.hasPrescription}
              label="J'ai vérifié que les séances ont bien été prescrites
                par un médecin ou un Service de Santé Universitaire"
              hint="J'ai vu sa carte d'étudiant ou un autre justificatif"
              value="hasPrescription"
              onChange={e => changePatient(e.target.checked, 'hasPrescription')}
            />
            <Checkbox
              className="fr-input-group"
              defaultChecked={patient.isStudentStatusVerified}
              label="J'ai vérifié le statut étudiant"
              hint="L'étudiant m'a présenté une lettre ou ordonnance médicale"
              value="isStudentStatusVerified"
              onChange={e => changePatient(e.target.checked, 'isStudentStatusVerified')}
            />
            <TextInput
              className="midlength-input"
              data-test-id="etudiant-doctor-name-input"
              label="Médecin ou Service de Santé Universitaire qui a orienté cet étudiant"
              hint="Exemple : Annie Benahmou ou SSU Rennes 1"
              value={patient.doctorName}
              onChange={e => changePatient(e.target.value, 'doctorName')}
            />
            <TextInput
              className="midlength-input"
              label="Ville et/ou code postal du médecin ou Service de Santé Universitaire"
              hint="Exemple : 97400 Saint-Denis"
              value={patient.doctorAddress}
              onChange={e => changePatient(e.target.value, 'doctorAddress')}
            />
          </div>
        </>
        )}
        <div className="fr-my-5w">
          <Button
            submit
            id="save-etudiant-button"
            data-test-id="save-etudiant-button"
            icon={button.icon}
          >
            {button.text}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditPatient;
