import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import DatePicker from 'react-datepicker';
import { Button, SearchableSelect, Select } from '@dataesr/react-dsfr';

import DateInput from 'components/Date/DateInput';

import agent from 'services/agent';
import { convertLocalToUTCDate } from 'services/date';

import { useStore } from 'stores/';

import 'react-datepicker/dist/react-datepicker.css';

const NewAppointment = () => {
  const history = useHistory();
  const [date, setDate] = useState();
  const params = useParams();
  const [patientId, setPatientId] = useState(params.patientId);
  const [patients, setPatients] = useState([]);

  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    agent.Patient.get().then(setPatients);
  }, []);

  const createNewAppointment = e => {
    e.preventDefault();
    setNotification({});
    agent.Appointment.add(patientId, date).then(response => {
      history.push('/psychologue/mes-seances');
      setNotification(response);
    });
  };

  const patientsMap = patients.map(patient => (
    { value: patient.id, label: `${patient.lastName} ${patient.firstNames}` }
  ));
  const defaultString = [{ value: '', label: '--- Selectionner un étudiant', disabled: true, hidden: true }];
  const allOptions = defaultString.concat(patientsMap);

  return (
    <form onSubmit={createNewAppointment} className="fr-my-2w">
      {patients.length > 0 ? (
        <SearchableSelect
          className="midlength-select"
          data-test-id="new-appointment-etudiant-input"
          id="etudiants"
          name="patientId"
          label="Etudiant"
          selected={patientId}
          hint={(
            <>
              Votre étudiant n&lsquo;est pas dans la liste ?
              {' '}
              <HashLink to="/psychologue/nouvel-etudiant">Ajoutez un nouvel étudiant</HashLink>
            </>
              )}
          onChange={e => { setPatientId(e); }}
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
          hint={(
            <>
              Vous n&lsquo;avez aucun étudiant dans votre liste!
              {' '}
              <HashLink to="/psychologue/nouvel-etudiant">Ajoutez un nouvel étudiant</HashLink>
            </>
          )}
        />
      )}
      <DatePicker
        className="date-picker"
        selected={date}
        dateFormat="dd/MM/yyyy"
        showPopperArrow={false}
        customInput={(
          <DateInput
            label="Date de la séance"
            dataTestId="new-appointment-date-input"
          />
        )}
        onChange={newDate => setDate(convertLocalToUTCDate(newDate))}
        required
      />
      <Button
        data-test-id="new-appointment-submit"
        submit
        className="fr-fi-add-line fr-btn--icon-left fr-mt-4w"
      >
        Créer la séance
      </Button>
    </form>
  );
};

export default NewAppointment;
