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
  const [customINESError, setCustomINESError] = useState(null);

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
        badges: [],
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
        const errorMessage = err?.response?.data?.message || '';
        if (errorMessage.includes('API_INES_VALIDATION_FAILED')) {
          setCustomINESError(true);
        }
        window.scrollTo(0, 0);
      });
  };

  return (
    <div className="fr-my-2w">
      {customINESError && (
        <Notification type="warning">
          <b>INE non reconnu</b>
          <br />
          {' '}
          Le numéro INE et/ou la date naissance indiqué n&apos;est pas relié à un étudiant.
          <br />
          Or, un numéro INE valable doit être indiqué. Vous pouvez demander un contrôle.
          <br />
          <br />
          <Button
            onClick={() => navigate('/psychologue/envoi-certificat', {
              state: {
                patientId,
                patientName: `${patient.firstNames} ${patient.lastName}`,
                psychologistId: user.dossierNumber,
              },
            })}
          >
            Fournir le certificat de scolarité
          </Button>
        </Notification>
      )}

      <ScrollToTop loading={!!patient} />
      {patient && (
        <form onSubmit={save}>
          <div id="mandatory-informations">
            {patientId
            && (
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
            <PatientInfo patient={patient} changePatient={changePatient} />
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
