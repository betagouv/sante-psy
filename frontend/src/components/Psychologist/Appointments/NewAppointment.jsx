import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import DatePicker from 'react-datepicker';
import { Alert, Button, Checkbox, SearchableSelect, Select } from '@dataesr/react-dsfr';

import DateInput from 'components/Date/DateInput';

import agent from 'services/agent';
import { convertLocalToUTCDate } from 'services/date';

import { useStore } from 'stores/';
import { observer } from 'mobx-react';

import 'react-datepicker/dist/react-datepicker.css';

const MAX_APPOINTMENT = 16;

const NewAppointment = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const params = useParams();
  const [patientId, setPatientId] = useState(params.patientId);
  const [patients, setPatients] = useState([]);
  const [understand, setUnderstand] = useState(false);

  const {
    commonStore: { setNotification },
    userStore: { user },
  } = useStore();

  useEffect(() => {
    agent.Patient.get().then(setPatients);
  }, []);

  const patient = useMemo(() => patients && patients.find(p => p.id === patientId), [patients, patientId]);

  const tooMuchAppointments = useMemo(() => patient && patient.appointmentsCount > MAX_APPOINTMENT, [patient]);

  const createNewAppointment = e => {
    e.preventDefault();
    setNotification({});
    agent.Appointment.add(patientId, date).then(response => {
      navigate('/psychologue/mes-seances', { state: { notification: response } });
    });
  };

  const beginningDate = new Date(user.createdAt);
  const today = new Date();
  const maxDate = new Date(today.setMonth(today.getMonth() + 4));

  const patientsMap = patients.map(p => ({
    value: p.id,
    label: `${p.lastName} ${p.firstNames}`,
  }));

  const defaultString = [
    {
      value: '',
      label: '--- Selectionner un étudiant',
      disabled: true,
      hidden: true,
    },
  ];
  const allOptions = defaultString.concat(patientsMap);

  return (
    <form onSubmit={createNewAppointment} className="fr-my-2w">
      <div id="patients-list">
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
                <HashLink to="/psychologue/nouvel-etudiant" id="new-patient">
                  Ajoutez un nouvel étudiant
                </HashLink>
              </>
            )}
            onChange={e => {
              setPatientId(e);
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
            hint={(
              <>
                Vous n&lsquo;avez aucun étudiant dans votre liste!
                {' '}
                <HashLink to="/psychologue/nouvel-etudiant" id="new-patient">
                  Ajoutez un nouvel étudiant
                </HashLink>
              </>
            )}
          />
        )}
      </div>
      <DatePicker
        id="new-appointment-date-input"
        className="date-picker"
        selected={date}
        minDate={beginningDate}
        maxDate={maxDate}
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
      {tooMuchAppointments && (
      <Alert
        className="fr-mt-2w"
        description={(
          <>
            Attention ! Vous avez dépassé le nombre de séances prévues dans le cadre de ce dispositif.
            <Checkbox
              className="fr-mt-1w"
              data-test-id="new-appointment-understand"
              label="J'ai conscience que seules 16 séances (inclus renouvellement) seront prises en charge par l'université."
              onChange={e => setUnderstand(e.target.checked)}
            />
          </>
        )}
      />
      )}
      <Button
        id="new-appointment-submit"
        data-test-id="new-appointment-submit"
        submit
        icon="ri-add-line"
        className="fr-mt-4w"
        disabled={tooMuchAppointments && !understand}
      >
        Créer la séance
      </Button>
    </form>
  );
};

export default observer(NewAppointment);
