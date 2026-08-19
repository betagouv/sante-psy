import React from 'react';
import { Select } from '@dataesr/react-dsfr';
import { SearchableSelect } from '@dataesr/react-dsfr';
import { HashLink } from 'react-router-hash-link';
import { formatDDMMYYYY } from 'services/date';

const NewAppointmentPatientsList = ({
  isEmpty,
  patientId,
  setPatientId,
  allOptions,
  date,
  setNotification,
}) => {
  return (
    <div id="patients-list" className="fr-mb-2w">
      {!isEmpty ? (
        <SearchableSelect
          className="midlength-select"
          data-test-id="new-appointment-etudiant-input"
          id="etudiants"
          name="patientId"
          label="Etudiant"
          selected={patientId}
          hint={
            <>
              Votre étudiant n&lsquo;est pas dans la liste ?{' '}
              <HashLink to="/psychologue/nouvel-etudiant" id="new-patient">
                Ajoutez un nouvel étudiant
              </HashLink>
            </>
          }
          onChange={(e) => {
            setPatientId(e);
            setNotification({});
          }}
          required
          options={allOptions}
        />
      ) : (
        <Select
          className="midlength-select"
          label="Etudiant"
          disabled
          required
          options={[]}
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
        />
      )}
    </div>
  );
};

export default NewAppointmentPatientsList;
