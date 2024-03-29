import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, TextInput, Checkbox } from '@dataesr/react-dsfr';

import { formatDDMMYYYY } from 'services/date';
import agent from 'services/agent';

import renderBadge from 'components/Badges/generateBadges';
import styles from './addEditPatient.cssmodule.scss';

const AddEditPatient = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { patientId } = useParams();
  const appointmentDate = new URLSearchParams(search).get('appointmentDate');
  const addAppointment = new URLSearchParams(search).get('addAppointment');

  const [patient, setPatient] = useState();

  useEffect(() => {
    if (patientId) {
      agent.Patient.getOne(patientId).then(response => {
        setPatient({
          ...response,
          dateOfBirth: response.dateOfBirth
            ? formatDDMMYYYY(new Date(response.dateOfBirth))
            : '',
          dateOfPrescription: response.dateOfPrescription
            ? formatDDMMYYYY(new Date(response.dateOfPrescription))
            : '',
        });
      });
    } else {
      setPatient({
        INE: '',
        dateOfBirth: '',
        doctorAddress: '',
        doctorName: '',
        doctorEmail: '',
        dateOfPrescription: '',
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
        if (appointmentDate) {
          navigate(
            `/psychologue/nouvelle-seance/${patientId}?date=${appointmentDate}`,
            { state: { notification: response } },
          );
        } else if (addAppointment) {
          navigate(`/psychologue/nouvelle-seance/${patientId}`, { state: { notification: response } });
        } else {
          navigate('/psychologue/mes-etudiants', { state: { notification: response } });
        }
      })
      .catch(() => window.scrollTo(0, 0));
  };

  const areStudentInfosFilled = () => (
    patient
      && patient.firstNames
      && patient.lastName
      && patient.dateOfBirth
      && patient.institutionName
      && patient.INE
  );

  const arePrescriptionInfosFilled = () => (
    patient
      && patient.doctorAddress
      && patient.doctorName
      && patient.doctorEmail
      && patient.dateOfPrescription
      && patient.hasPrescription
  );

  return (
    <div className="fr-my-2w">
      <form onSubmit={save}>
        {patient && (
          <>
            <div id="mandatory-informations">
              <section className={styles.studentSectionTitle}>
                <h2>Dossier étudiant</h2>
                {!areStudentInfosFilled()
                  ? renderBadge({ badge: 'student_infos' })
                  : ''}
              </section>
              <p className="fr-text--sm fr-mb-1v">
                Les champs avec une astérisque (
                <span className="red-text">*</span>
                )
                sont obligatoires.
              </p>
              <p className="fr-text--sm fr-mb-1v">
                S&lsquo;il vous manque des champs non-obligatoires, vous pourrez y
                revenir plus tard pour compléter le dossier.
              </p>
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
                data-test-id="etudiant-birth-date-input"
                label="Date de naissance"
                hint="Format JJ/MM/AAAA, par exemple : 25/01/1987"
                value={patient.dateOfBirth}
                type="text"
                onChange={e => changePatient(e.target.value, 'dateOfBirth')}
                pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
                placeholder="JJ/MM/AAAA"
                required={!patientId}
              />
            </div>
            <br />
            <div id="other-informations">
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
                data-test-id="etudiant-ine-input"
                label="Numéro INE de l'étudiant (optionnel)"
                hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant."
                value={patient.INE}
                pattern="^[a-zA-Z0-9]{1,11}$"
                onChange={e => changePatient(e.target.value, 'INE')}
              />
              <Checkbox
                className="fr-input-group"
                data-test-id="etudiant-status-input"
                defaultChecked={patient.isStudentStatusVerified}
                label="J'ai bien vérifié le statut étudiant"
                hint="J'ai vu sa carte d'étudiant ou un autre justificatif"
                value="isStudentStatusVerified"
                onChange={e => changePatient(e.target.checked, 'isStudentStatusVerified')}
              />
              <section className={styles.studentSectionTitle}>
                <h2>Lettre d&apos;orientation</h2>
                {!arePrescriptionInfosFilled()
                  ? renderBadge({ badge: 'prescription_infos' })
                  : ''}
              </section>
              <Checkbox
                className="fr-input-group"
                data-test-id="etudiant-letter-input"
                defaultChecked={patient.hasPrescription}
                label={`J'ai vérifié que les séances ont bien été orientées
                par un médecin`}
                hint="L’étudiant m’a bien présenté la lettre d’orientation rédigée par son médecin, pour l’année en cours"
                value="hasPrescription"
                onChange={e => changePatient(e.target.checked, 'hasPrescription')}
              />
              <TextInput
                className="midlength-input"
                data-test-id="etudiant-doctor-name-input"
                label="Nom, prénom du médecin"
                hint="Exemple : Annie Benahmou"
                value={patient.doctorName}
                onChange={e => changePatient(e.target.value, 'doctorName')}
              />
              <TextInput
                className="midlength-input"
                data-test-id="etudiant-doctor-location-input"
                label="Ville / code postal du médecin"
                hint="Exemple : 97400 Saint-Denis"
                value={patient.doctorAddress}
                onChange={e => changePatient(e.target.value, 'doctorAddress')}
              />
              <TextInput
                className="midlength-input"
                data-test-id="etudiant-doctor-email-input"
                label="Email du médecin"
                hint="Il servira si vous souhaitez participer au suivi de l’étudiant par le médecin"
                value={patient.doctorEmail}
                onChange={e => changePatient(e.target.value, 'doctorEmail')}
              />
              <TextInput
                className="midlength-input"
                data-test-id="etudiant-prescription-date-input"
                label={"Date de la lettre d'orientation"}
                hint="Format JJ/MM/AAAA, par exemple : 01/01/2024"
                value={patient.dateOfPrescription}
                type="text"
                onChange={e => changePatient(e.target.value, 'dateOfPrescription')}
                pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
                placeholder="JJ/MM/AAAA"
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
