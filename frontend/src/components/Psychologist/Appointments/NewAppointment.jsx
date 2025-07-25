import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import DatePicker from 'react-datepicker';
import { Alert, Button, Checkbox, SearchableSelect, Select } from '@dataesr/react-dsfr';

import DateInput from 'components/Date/DateInput';

import agent from 'services/agent';
import { convertLocalToUTCDate, formatDDMMYYYY, parseDateForm } from 'services/date';

import { useStore } from 'stores/';
import { observer } from 'mobx-react';

import 'react-datepicker/dist/react-datepicker.css';
import PatientAppointments from '../Patients/PatientAppointments';
import styles from './newAppointment.cssmodule.scss';

export const MAX_APPOINTMENT = 12;

const NewAppointment = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryDate = new URLSearchParams(search).get('date');
  const [date, setDate] = useState();
  const params = useParams();
  const [patientId, setPatientId] = useState(params.patientId);
  const [patients, setPatients] = useState([]);
  const [understand, setUnderstand] = useState(false);

  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    if (queryDate) {
      const parsedDate = parseDateForm(queryDate);
      if (parsedDate instanceof Date && !Number.isNaN(parsedDate)) {
        setDate(parsedDate);
      }
    }
    agent.Patient.get().then(setPatients);
  }, []);

  const patient = useMemo(() => patients?.find(p => p.id === patientId), [patients, patientId]);
  const INEhasBeenValidated = patient?.isINESvalid;
  const tooMuchAppointments = useMemo(() => patient && patient.countedAppointments >= MAX_APPOINTMENT, [patient]);
  const hasAllCompulsoryInfo = useMemo(() => (patient && patient.INE && patient.dateOfBirth && patient.gender && INEhasBeenValidated), [patient]);
  const createNewAppointment = e => {
    e.preventDefault();
    setNotification({});
    agent.Appointment.add(patientId, date).then(response => {
      navigate('/psychologue/mes-seances', { state: { notification: response } });
    });
  };

  const beginningDate = new Date(2025, 0, 1);
  const maxDate = new Date();

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
    <div className={styles.newAppointmentWrapper}>
      <form onSubmit={createNewAppointment} className="fr-my-2w">
        <div className={styles.message}>
          Vous pouvez vous faire rembourser
          <ul>
            <li>jusqu&lsquo;à 12 séances depuis le 1er juillet 2024.</li>
            <li>jusqu&lsquo;à 8 séances avant le 1er juillet 2024.</li>
          </ul>
        </div>
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
                  <HashLink to={`/psychologue/nouvel-etudiant?addAppointment=true&appointmentDate=${formatDDMMYYYY(date)}`} id="new-patient">
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
                  Vous n&lsquo;avez aucun étudiant dans votre liste !
                  {' '}
                  <HashLink to={`/psychologue/nouvel-etudiant?addAppointment=true&appointmentDate=${formatDDMMYYYY(date)}`} id="new-patient">
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
          customInput={<DateInput label="Date de la séance" dataTestId="new-appointment-date-input" disabled={!hasAllCompulsoryInfo} />}
          onChange={newDate => setDate(convertLocalToUTCDate(newDate))}
          required
          disabled={!hasAllCompulsoryInfo}
        />
        {patientId && !hasAllCompulsoryInfo && (
          <>
            <Alert
              className="fr-mt-2w"
              type="warning"
              data-test-id="alert-missing-data"
              title="Problème avec le dossier étudiant"
              description={(
                <>
                  Le dossier de l&apos;étudiant doit être complet pour ajouter des séances : INE valide, date de naissance, genre...
                  <br />
                </>
              )} />
            <br />
            <Button
              onClick={() => navigate(`/psychologue/modifier-etudiant/${patientId}?addAppointment=true`)}
            >
              Compléter le dossier étudiant
            </Button>
          </>
        )}
        {tooMuchAppointments && (
          <>
            <Alert
              className="fr-mt-2w"
              description={(
                <>
                  Attention ! Vous avez dépassé le nombre de séances prévues dans le cadre de ce dispositif.
                </>
              )}
            />
            <Checkbox
              className="fr-mt-1w"
              data-test-id="new-appointment-understand"
              label={`J'ai conscience que seules ${MAX_APPOINTMENT} séances seront prises en charge par année universitaire.`}
              onChange={e => setUnderstand(e.target.checked)}
            />
          </>
        )}
        <div className={styles.submitCancelButtonsWrapper}>
          <Button
            id="new-appointment-submit"
            data-test-id="new-appointment-submit"
            submit
            icon="ri-add-line"
            className="fr-mt-4w"
            disabled={(tooMuchAppointments && !understand) || !hasAllCompulsoryInfo}
          >
            Créer la séance
          </Button>
          <Button
            secondary
            className="fr-mt-4w"
            onClick={() => navigate('/psychologue/mes-seances')}
          >
            Annuler
          </Button>
        </div>
      </form>
      {patientId && <PatientAppointments showCreateButton={false} patientId={patientId} />}
    </div>

  );
};

export default observer(NewAppointment);
