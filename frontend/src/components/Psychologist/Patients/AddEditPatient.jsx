import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, TextInput, Checkbox } from '@dataesr/react-dsfr';

import Ariane from 'components/Ariane/Ariane';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';
import Input from 'components/Form/Input';

import { useStore } from 'stores/';

import { formatDDMMYYYY } from 'services/date';
import agent from 'services/agent';

const AddEditPatient = () => {
  const history = useHistory();
  const { commonStore: { config, setNotification } } = useStore();
  const { patientId } = useParams();

  const [patient, setPatient] = useState({
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

  useEffect(() => {
    if (patientId) {
      agent.Patient.getOne(patientId).then(response => {
        setPatient({
          ...response.patient,
          dateOfBirth: response.patient.dateOfBirth
            ? formatDDMMYYYY(new Date(response.patient.dateOfBirth))
            : '',
        });
      });
    }
  }, [patientId]);

  const changePatient = (value, field) => {
    setPatient({ ...patient, [field]: value });
  };

  const pageTitle = patientId ? 'Modifier un patient' : 'Nouveau patient';
  const intro = patientId
    ? 'Modifiez les informations de l\'étudiant.'
    : 'Déclarez un étudiant comme étant patient du dispositif Santé Psy Etudiants. Vous pourrez ensuite déclarer les séances réalisées avec ce patient.';

  const button = {
    icon: patientId ? 'fr-fi-check-line' : 'fr-fi-add-line',
    text: patientId ? 'Valider les modifications' : 'Ajouter le patient',
  };
  const save = e => {
    e.preventDefault();
    const action = patientId
      ? agent.Patient.update(patientId, patient)
      : agent.Patient.create(patient);
    action
      .then(response => {
        history.push('/psychologue/mes-patients');
        setNotification(response);
      })
      .catch(() => window.scrollTo(0, 0));
  };
  return (
    <div className="fr-container fr-mb-3w">
      <Ariane
        previous={[
          {
            label: 'Gérer mes patients',
            url: '/psychologue/mes-patients',
          }]}
        current={pageTitle}
      />
      <h1>{pageTitle}</h1>
      <p className="fr-mb-2w">{intro}</p>
      <GlobalNotification />
      <div className="fr-my-3w">
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
          <div>
            <TextInput
              data-test-id="patient-first-name-input"
              label="Prénoms"
              value={patient.firstNames}
              onChange={ e => changePatient(e.target.value, "firstNames")}
              required
            />
            <TextInput
              data-test-id="patient-last-name-input"
              label="Nom"
              value={patient.lastName}
              onChange={ e => changePatient(e.target.value, "lastName")}
              required
            />
            {/* INPUT A MODIFIER */}
            <Input
              label={`Date de naissance (obligatoire uniquement pour vos patients enregistrés après le
                ${config.dateOfBirthDeploymentDate}
                )`}
              hint="Format JJ/MM/AAAA, par exemple : 25/01/1987"
              type="text"
              value={patient.dateOfBirth}
              onChange={changePatient}
              pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
              placeholder="JJ/MM/AAAA"
            />
            <TextInput
              label="Établissement scolaire de l'étudiant"
              hint="Exemple : Université de Rennes ou ENSAE"
              value={patient.institutionName}
              onChange={ e => changePatient(e.target.value, "institutionName")}
            />
            <TextInput
              label="Numéro INE de l'étudiant (optionnel)"
              hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant."
              value={patient.INE}
              onChange={ e => changePatient(e.target.value, "INE")}
            />
            <Checkbox
              label="J'ai vérifié que les séances ont bien été prescrites
              par un médecin ou un Service de Santé Universitaire"
              hint="J'ai vu sa carte d'étudiant ou un autre justificatif"
              value="false"
              onChange={ e => changePatient(e.target.value, "hasPrescription")}
            />
            <Checkbox
              label="J'ai vérifié le statut étudiant de ce patient"
              hint="L'étudiant m'a présenté une lettre ou ordonnance médicale"
              value="false"
              onChange={ e => changePatient(e.target.value, "isStudentStatusVerified")}
            />
            <TextInput
              data-test-id="patient-doctor-name-input"
              label="Médecin ou Service de Santé Universitaire qui a orienté ce patient"
              hint="Exemple : Annie Benahmou ou SSU Rennes 1"
              value={patient.doctorName}
              onChange={ e => changePatient(e.target.value, "doctorName")}
            />
            <TextInput
              label="Ville et/ou code postal du médecin ou Service de Santé Universitaire"
              hint="Exemple : 97400 Saint-Denis"
              value={patient.doctorAddress}
              onChange={ e => changePatient(e.target.value, "doctorAddress")}
            />
          </div>
          <div className="fr-my-5w">
            <Button
              submit
              data-test-id="save-patient-button"
              className={`fr-btn--icon-left ${button.icon}`}
            >
              {button.text}
            </Button>
          </div>
        </form>
      </div>
      <Mail />
    </div>
  );
};

export default AddEditPatient;
