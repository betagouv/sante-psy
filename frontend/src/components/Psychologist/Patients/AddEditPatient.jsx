import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, TextInput, Checkbox, Highlight } from '@dataesr/react-dsfr';

import { formatDDMMYYYY } from 'services/date';
import agent from 'services/agent';

import { renderBadge } from 'components/Badges/Badges';
import getBadgeInfos from 'src/utils/badges';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import classNames from 'classnames';
import styles from './addEditPatient.cssmodule.scss';
import PatientAppointments from './PatientAppointments';

const AddEditPatient = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { patientId } = useParams();
  const appointmentDate = new URLSearchParams(search).get('appointmentDate');
  const addAppointment = new URLSearchParams(search).get('addAppointment');

  const [patient, setPatient] = useState();

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
      .catch(() => window.scrollTo(0, 0));
  };

  return (
    <div className="fr-my-2w">
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
            <div className={styles.ineWrapper}>
              <TextInput
                className={classNames(styles.ineInput, 'midlength-input')}
                data-test-id="etudiant-ine-input"
                label="Numéro INE de l'étudiant"
                hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant ou le certificat de scolarité."
                value={patient.INE}
                pattern="^[a-zA-Z0-9]{11}$"
                onChange={e => changePatient(e.target.value, 'INE')}
                required
                />

              <Highlight size="lg" className={styles.ineHighlight}>
                L&lsquo;INE est désormais obligatoire pour pouvoir déclarer des séances afin de pouvoir maintenir à jour le compte des séances pour les étudiants.
                {' '}
              </Highlight>
            </div>
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
              data-test-id="etudiant-doctor-name-input"
              label="Nom, prénom du médecin (optionnel)"
              hint="Exemple : Annie Benahmou"
              value={patient.doctorName}
              onChange={e => changePatient(e.target.value, 'doctorName')}
                />
            {patientId && (
              <div id="anchor-student-list" className={styles.patientAppointments}>
                <PatientAppointments patientId={patientId} />
              </div>
            )}
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
        </form>
      )}
    </div>
  );
};

export default AddEditPatient;
