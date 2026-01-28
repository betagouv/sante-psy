import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@dataesr/react-dsfr';

import { formatDDMMYYYY } from 'services/date';
import agent from 'services/agent';

import { renderBadge } from 'components/Badges/Badges';
import getBadgeInfos from 'src/utils/badges';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import Notification from 'components/Notification/Notification';
import { useStore } from 'stores/index';
import styles from './addEditPatient.cssmodule.scss';
import PatientAppointments from './PatientAppointments';
import PatientInfo from './AddEditPatientInfo';

const AddEditPatient = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { patientId } = useParams();
  const appointmentDate = new URLSearchParams(search).get('appointmentDate');
  const addAppointment = new URLSearchParams(search).get('addAppointment');
  const { userStore: { user } } = useStore();
  const [patient, setPatient] = useState();
  const [customINESError, setCustomINESError] = useState(false);
  const [customErrorsAlert, setCustomErrorsAlert] = useState(false);
  const [createdPatientId, setCreatedPatientId] = useState(null);
  const [errors, setErrors] = useState({ dateOfBirth: false, ine: false });
  const badges = getBadgeInfos();

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
        gender: '',
        doctorName: '',
        firstNames: '',
        institutionName: '',
        isStudentStatusVerified: false,
        lastName: '',
        isINESvalid: false,
        email: '',
        badges: [],
      });
    }
  }, [patientId]);

  const changePatient = (value, field) => {
    setPatient({ ...patient, [field]: value });
  };

  const handleFormErrors = (type, value) => {
    if (Object.keys(errors).includes(type)) {
      setErrors({ ...errors, [type]: value });
    }
  };

  const button = {
    icon: patientId ? 'fr-fi-check-line' : 'fr-fi-add-line',
    text: patientId ? 'Valider les modifications' : "Ajouter l'étudiant",
  };
  const save = e => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) {
      setCustomErrorsAlert(true);
      window.scrollTo(0, 0);
      return;
    }
    setCustomErrorsAlert(false);

    const action = patientId
      ? agent.Patient.update(patientId, patient)
      : agent.Patient.create(patient);
    action
      .then(response => {
        if (!response?.isINESvalid) {
          setCustomINESError(true);
          setCreatedPatientId(response?.patientId);
          window.scrollTo(0, 0);
        } else if (appointmentDate) {
          navigate(
            `/psychologue/nouvelle-seance/${patientId || response.patientId}?date=${appointmentDate}`,
            { state: { notification: response } },
          );
        } else if (addAppointment) {
          navigate(`/psychologue/nouvelle-seance/${patientId || response.patientId}`, { state: { notification: response } });
        } else {
          navigate('/psychologue/mes-etudiants', { state: { notification: response } });
        }
      })
      .catch(err => {
        console.log(err?.response?.data?.message);
        window.scrollTo(0, 0);
      });
  };

  return (
    <div className="fr-my-2w">
      {patientId && !patient?.isINESvalid && !customINESError && !customErrorsAlert && (
        <Notification type="info">
          <b>Contrôle de l&apos;INE</b>
          <br />
          {' '}
          Veuillez confirmer les informations du patient afin que le numéro INE puisse être vérifié automatiquement.
          <br />
          Attention, vous ne pourrez pas créer de nouvelle séance pour ce patient tant que son numéro INE ne sera pas validé.
          <br />
          <br />
          <Button
            onClick={save}
          >
            Je confirme ces informations
          </Button>
        </Notification>
      )}
      {customINESError && (
        <Notification type="warning">
          <b>Etudiant non reconnu</b>
          <br />
          {' '}
          Le numéro INE et/ou la date naissance indiqué n&apos;est pas relié à un étudiant.
          <br />
          La bonne date de naissance et un numéro INE valable doivent être indiqués.
          <br />
          <br />
          <Button
            onClick={() => navigate('/psychologue/envoi-certificat', {
              state: {
                patientId: createdPatientId || patientId,
                patientName: `${patient.firstNames} ${patient.lastName}`,
                psychologistId: user.dossierNumber,
              },
            })}
          >
            Fournir le certificat de scolarité
          </Button>
        </Notification>
      )}

      {customErrorsAlert && (
        <Notification type="warning">
          {' '}
          INE et/ou date de naissance invalide.
          <br />
        </Notification>
      )}

      <ScrollToTop loading={!!patient} />
      {patient && (
        <form onSubmit={save}>
          <div>
            {patientId && (
              <section id="anchor-student-file" className={styles.studentSectionTitle}>
                <h2>
                  {patient.firstNames}
                  {' '}
                  {patient.lastName}
                </h2>
                {patient.badges.includes(badges.student_ine.key)
                  ? renderBadge({ badge: badges.student_ine.key })
                  : ''}
              </section>
            )}
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
            <PatientInfo patient={patient} changePatient={changePatient} handleFormErrors={handleFormErrors} />
          </div>
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
          <div>
            {patientId && (
              <div id="anchor-student-list" className={styles.patientAppointments}>
                <PatientAppointments patientId={patientId} />
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default AddEditPatient;
