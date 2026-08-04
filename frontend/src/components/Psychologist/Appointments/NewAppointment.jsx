import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import DatePicker from 'react-datepicker';
import {
  Alert,
  Button,
  SearchableSelect,
  Select,
  Checkbox,
  CheckboxGroup,
} from '@dataesr/react-dsfr';

import DateInput from 'components/Date/DateInput';

import agent from 'services/agent';
import {
  convertLocalToUTCDate,
  formatDDMMYYYY,
  getFirstDayOfLastMonth,
  parseDateForm,
} from 'services/date';

import { useStore } from 'stores/';
import { observer } from 'mobx-react';

import 'react-datepicker/dist/react-datepicker.css';
import PatientAppointments from '../Patients/PatientAppointments';
import styles from './newAppointment.cssmodule.scss';

export const MAX_APPOINTMENT = 12;

const NewAppointment = () => {
  const navigate = useNavigate();
  const { search, state } = useLocation();
  // TODO understand why we use this url param
  const queryDate = new URLSearchParams(search).get('date');
  const [date, setDate] = useState();
  const params = useParams();
  const [patientId, setPatientId] = useState(
    state?.patientId || params.patientId,
  );
  const [patients, setPatients] = useState([]);
  const [appointmentsRefreshKey, setAppointmentsRefreshKey] = useState(0);
  const [hasChangedInput, setHasChangedInput] = useState(true);
  const [checkCertifIdentity, setCheckCertifIdentity] = useState(false);
  const [checkCertifValidity, setCheckCertifValidity] = useState(false);

  const {
    commonStore: { setNotification },
  } = useStore();

  useEffect(() => setHasChangedInput(true), [date, patientId]);

  useEffect(() => {
    if (queryDate) {
      const parsedDate = parseDateForm(queryDate);
      if (parsedDate instanceof Date && !Number.isNaN(parsedDate)) {
        setDate(parsedDate);
      }
    }
    // TODO : pas besoin de remonter toutes les infos du patient, juste nom prénom wesh, puis après getOne quand j'en sélectionne un
    agent.Patient.get().then(setPatients);
  }, []);

  useEffect(() => {
    setCheckCertifIdentity(false);
    setCheckCertifValidity(false);
  }, [patientId]);

  const patient = useMemo(
    () => patients?.find((p) => p.id === patientId),
    [patients, patientId],
  );
  const tooMuchAppointments = useMemo(
    () => patient && Number(patient.countedAppointments) >= MAX_APPOINTMENT,
    [patient],
  );

  const isFirstAppointmentEver = useMemo(
    () => patient && Number(patient.appointmentsCount) === 0,
    [patient],
  );
  const isFirstAppointmentOfTheYear = useMemo(
    () =>
      patient &&
      Number(patient.countedAppointments) === 0 &&
      Number(patient.appointmentsCount) !== 0,
    [patient],
  );
  const requiresCertificateCheck =
    isFirstAppointmentEver || isFirstAppointmentOfTheYear;

  const canConfirmPatient = useMemo(
    () =>
      !requiresCertificateCheck || (checkCertifIdentity && checkCertifValidity),
    [checkCertifIdentity, checkCertifValidity, requiresCertificateCheck],
  );

  const onUpdatePatientAppointments = () => {
    agent.Patient.get().then(setPatients);
    setAppointmentsRefreshKey((prev) => prev + 1);
  };

  const canCreateAppointment = useMemo(() => {
    return (
      canConfirmPatient && !!date && !tooMuchAppointments && hasChangedInput
    );
  }, [date, tooMuchAppointments, hasChangedInput, canConfirmPatient]);

  const createNewAppointment = (e) => {
    e.preventDefault();
    setHasChangedInput(false);
    setNotification({});
    agent.Appointment.add(patientId, date).then((response) => {
      setNotification(response);
      onUpdatePatientAppointments();
    });
  };

  const beginningDate = getFirstDayOfLastMonth();
  const maxDate = new Date();

  const patientsMap = patients.map((p) => ({
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
        <div id="patients-list" className="fr-mb-2w">
          {patients.length > 0 ? (
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
        {patientId && !tooMuchAppointments && (
          <DatePicker
            id="new-appointment-date-input"
            className="date-picker"
            selected={date}
            minDate={beginningDate}
            maxDate={maxDate}
            dateFormat="dd/MM/yyyy"
            showPopperArrow={false}
            customInput={
              <DateInput
                label="Date de la séance"
                hint={
                  <>
                    Les séances doivent être déclarées au plus tard le dernier
                    jour du mois suivant leur réalisation. Pour toute aide,{' '}
                    <HashLink to="/contact/formulaire">
                      contactez le support.
                    </HashLink>
                  </>
                }
                dataTestId="new-appointment-date-input"
              />
            }
            onChange={(newDate) => setDate(convertLocalToUTCDate(newDate))}
            required
          />
        )}
        {tooMuchAppointments && (
          <Alert
            className="fr-mt-2w"
            type="warning"
            description={
              <>
                Cet étudiant a atteint le nombre maximum de séances prises en
                charge pour l&apos;année scolaire en cours. Il n&apos;est pas
                possible d&apos;en déclarer de nouvelles avant la prochaine
                rentrée. Si vous constatez une erreur dans le décompte, veuillez{' '}
                <HashLink to="/contact/formulaire">
                  contacter le support
                </HashLink>
                .
              </>
            }
          />
        )}
        {requiresCertificateCheck && (
          <>
            <Alert
              className="fr-my-3w"
              type="info"
              description={
                isFirstAppointmentEver
                  ? 'Première séance avec cet étudiant - veuillez vérifier le certificat de scolarité avant de confirmer.'
                  : 'Première séance avec cet étudiant pour la nouvelle année universitaire - veuillez vérifier le certificat de scolarité avant de confirmer.'
              }
            />
            <CheckboxGroup>
              <Checkbox
                label="J'ai bien comparé l'identité de l'étudiant avec le certificat de scolarité"
                onChange={(e) => setCheckCertifIdentity(e.target.checked)}
                checked={checkCertifIdentity}
                hint="ou l'attestation CVEC fournie"
              />
              <Checkbox
                label="J'ai vérifié que le certificat de scolarité est valable sur la période en cours"
                onChange={(e) => setCheckCertifValidity(e.target.checked)}
                checked={checkCertifValidity}
              />
            </CheckboxGroup>
          </>
        )}
        <div className={styles.submitCancelButtonsWrapper}>
          <Button
            id="new-appointment-submit"
            data-test-id="new-appointment-submit"
            submit
            icon="ri-add-line"
            className="fr-mt-4w"
            disabled={!canCreateAppointment}
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
      {patientId && (
        <PatientAppointments
          showCreateButton={false}
          patientId={patientId}
          onUpdatePatientAppointments={onUpdatePatientAppointments}
          refreshKey={appointmentsRefreshKey}
        />
      )}
    </div>
  );
};

export default observer(NewAppointment);
