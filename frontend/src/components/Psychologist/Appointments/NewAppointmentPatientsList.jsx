import React from 'react';
import ReactSelect from 'react-select';
import { HashLink } from 'react-router-hash-link';
import { formatDDMMYYYY } from 'services/date';
import { Select } from '@codegouvfr/react-dsfr/Select';
import './ReactSelectDsfr.css';
import styles from './NewAppointmentPatientsList.cssmodule.scss';

const NewAppointmentPatientsList = ({
  isEmpty,
  patientId,
  setPatientId,
  allOptions,
  date,
  setNotification,
}) => {
  const selectedOption = allOptions.find((o) => o.value === patientId) ?? null;

  return (
    <div id="patients-list" className="fr-mb-2w">
      {!isEmpty ? (
        <div className={styles.container}>
          <label className={styles.label} htmlFor="etudiants">
            Etudiant
          </label>
          <span className={styles.hint}>
            Votre étudiant n&lsquo;est pas dans la liste ?{' '}
            <HashLink to="/psychologue/nouvel-etudiant" id="new-patient">
              Ajoutez un nouvel étudiant
            </HashLink>
          </span>
          <ReactSelect
            inputId="etudiants"
            name="patientId"
            data-test-id="new-appointment-etudiant-input"
            classNamePrefix="react-select"
            options={allOptions}
            value={selectedOption}
            onChange={(option) => {
              setPatientId(option ? option.value : null);
              setNotification({});
            }}
            placeholder="Rechercher un étudiant..."
            noOptionsMessage={() => 'Aucun étudiant trouvé'}
            isClearable
          />
        </div>
      ) : (
        <Select
          className="midlength-select"
          label="Etudiant"
          disabled
          required
          hint={
            <>
              Vous n&lsquo;avez aucun étudiant dans votre liste !{' '}
              <HashLink
                to={`/psychologue/nouvel-etudiant?addAppointment=true&appointmentDate=${formatDDMMYYYY(date)}`}
                id="new-patient"
              >
                Ajoutez un nouvel étudiant
              </HashLink>
            </>
          }
          nativeSelectProps={{ value: '', onChange: () => {} }}
        />
      )}
    </div>
  );
};

export default NewAppointmentPatientsList;
