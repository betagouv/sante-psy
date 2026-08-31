import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Alert, Button, Checkbox, CheckboxGroup } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { parseDateForm } from 'services/date';

import { useStore } from 'stores/';
import { observer } from 'mobx-react';

import 'react-datepicker/dist/react-datepicker.css';
import PatientAppointments from '../Patients/PatientAppointments';
import styles from './newAppointment.cssmodule.scss';
import { getUnivYear } from 'services/univYears';
import NewAppointmentDatePicker from './NewAppointmentDatePicker';
import NewAppointmentPatientsList from './NewAppointmentPatientsList';
import NewAppointmentSeeCertificate from './NewAppointmentSeeCertificate';

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
  const [serverError, setServerError] = useState(false);
  const [eligibilityInfo, setEligibilityInfo] = useState(null);

  const {
    commonStore: { setNotification },
  } = useStore();

  useEffect(() => {
    setHasChangedInput(true);
    setServerError(false);
  }, [date, patientId]);

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
    setDate(undefined);
  }, [patientId]);

  const selectedUnivYear = useMemo(
    () => (date ? getUnivYear(date, '-') : ''),
    [date],
  );
  const patient = useMemo(
    () => patients?.find((p) => p.id === patientId),
    [patients, patientId],
  );
  const tooManyAppointments = useMemo(
    () => patient && Number(patient.countedAppointments) >= MAX_APPOINTMENT,
    [patient],
  );

  const isFirstAppointmentEver = useMemo(
    () => eligibilityInfo && !eligibilityInfo.hadAnAppointmentWithPsy,
    [eligibilityInfo],
  );
  const isFirstAppointmentOfTheYear = useMemo(
    () => eligibilityInfo && !eligibilityInfo.hadAnAppointmentThisYear,
    [eligibilityInfo],
  );

  useEffect(() => {
    if (!patient?.student || !selectedUnivYear) {
      setEligibilityInfo(null);
      return;
    }
    agent.Psychologist.checkStudentEligibility(
      selectedUnivYear,
      patient.student.id,
    )
      .then((res) => {
        setEligibilityInfo(res);
      })
      .catch(() => {
        setServerError(true);
        setEligibilityInfo(null);
      });
  }, [patient, selectedUnivYear]);

  const patientHasNoAccount = useMemo(
    () => patient && !patient.student,
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
    if (
      !canConfirmPatient ||
      !date ||
      tooManyAppointments ||
      !hasChangedInput
    ) {
      return false;
    }

    // at this point, we can create appointment only if patient has a student account
    // except special case 2025-2026
    if (selectedUnivYear === '2025-2026') {
      return true;
    }
    return !patientHasNoAccount;
  }, [
    date,
    tooManyAppointments,
    hasChangedInput,
    canConfirmPatient,
    patientHasNoAccount,
    selectedUnivYear,
  ]);

  const createNewAppointment = (e) => {
    e.preventDefault();
    setHasChangedInput(false);
    setNotification({});
    agent.Appointment.add(patientId, date).then((response) => {
      setNotification(response);
      onUpdatePatientAppointments();
      setCheckCertifIdentity(false);
      setCheckCertifValidity(false);
      setDate(undefined);
    });
  };

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
  const renderButtons = () => (
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
  );

  const renderWarningOrForm = () => {
    if (!patientId || serverError) {
      return null;
    }

    // TODO: put back after 01 October 2026 plz
    // if (patientHasNoAccount) {
    //   return (
    //     <Alert
    //       className="fr-mt-2w"
    //       type="warning"
    //       description={<>Cet étudiant n'a pas créé son compte.</>}
    //     />
    //   );
    // }

    if (tooManyAppointments) {
      return (
        <Alert
          className="fr-mt-2w"
          type="warning"
          description={
            <>
              Cet étudiant a atteint le nombre maximum de séances prises en
              charge pour l&apos;année scolaire en cours. Il n&apos;est pas
              possible d&apos;en déclarer de nouvelles avant la prochaine
              rentrée. Si vous constatez une erreur dans le décompte, veuillez{' '}
              <HashLink to="/contact/formulaire">contacter le support</HashLink>
              .
            </>
          }
        />
      );
    }

    const toRender = [];

    toRender.push(
      <NewAppointmentDatePicker
        key="date-picker"
        date={date}
        setDate={setDate}
      />,
    );

    const eligibility = eligibilityInfo ? eligibilityInfo.eligibility : null;

    if (eligibility?.status === 'NOT_ELIGIBLE') {
      toRender.push(
        <Alert
          key="not-eligible-alert"
          type="warning"
          className="fr-my-3w"
          title="Cet étudiant n'est pas éligible au dispositif SPE"
        />,
      );
      return toRender;
    }

    if (eligibility?.status === 'PENDING') {
      toRender.push(
        <Alert
          key="pending-eligibility-alert"
          type="warning"
          className="fr-my-3w"
          title="L'éligibilité de cet étudiant est en cours d'instruction"
        />,
      );
      return toRender;
    }

    if (eligibility && !eligibility.isProfileComplete) {
      toRender.push(
        <Alert
          key="incomplete-profile-alert"
          type="warning"
          className="fr-my-3w"
          title="Le profil de cet étudiant n'est pas à jour"
        />,
      );
      return toRender;
    }

    if (
      patientHasNoAccount &&
      selectedUnivYear &&
      selectedUnivYear !== '2025-2026'
    ) {
      toRender.push(
        <Alert
          key="not-eligible-alert"
          type="warning"
          className="fr-my-3w"
          description={<>Cet étudiant n'a pas créé son compte.</>}
        />,
      );
      return toRender;
    }

    if (requiresCertificateCheck) {
      toRender.push(
        <Alert
          key="certif-check-alert"
          className="fr-my-3w"
          type="info"
          description={
            isFirstAppointmentEver
              ? '1ère séance avec cet étudiant - veuillez vérifier le justificatif de scolarité avant de confirmer'
              : '1ère séance avec cet étudiant pour la nouvelle année universitaire - veuillez vérifier le justificatif de scolarité avant de confirmer'
          }
        />,
      );
      toRender.push(
        <CheckboxGroup key="certif-checkboxes">
          <Checkbox
            label="J'ai comparé l'identité de l'étudiant avec le justificatif de scolarité"
            onChange={(e) => setCheckCertifIdentity(e.target.checked)}
            checked={checkCertifIdentity}
          />
          <Checkbox
            label="J'ai vérifié que le justificatif de scolarité présenté est valable sur l’année universitaire en cours"
            onChange={(e) => setCheckCertifValidity(e.target.checked)}
            checked={checkCertifValidity}
          />
        </CheckboxGroup>,
      );
    }

    toRender.push(
      <React.Fragment key="buttons">{renderButtons()}</React.Fragment>,
    );

    return toRender;
  };

  return (
    <div className={styles.newAppointmentWrapper}>
      <form onSubmit={createNewAppointment} className="fr-my-2w">
        <NewAppointmentPatientsList
          patientId={patientId}
          setPatientId={setPatientId}
          date={date}
          isEmpty={patients.length === 0}
          allOptions={allOptions}
          setNotification={setNotification}
        />
        {renderWarningOrForm()}
      </form>
      {patient?.student &&
      eligibilityInfo?.eligibility &&
      eligibilityInfo?.eligibility.canPsyDeclareAppointment &&
      requiresCertificateCheck &&
      selectedUnivYear ? (
        <NewAppointmentSeeCertificate
          studentId={patient.student.id}
          univYear={selectedUnivYear}
        />
      ) : (
        patientId && (
          <PatientAppointments
            showCreateButton={false}
            patientId={patientId}
            onUpdatePatientAppointments={onUpdatePatientAppointments}
            refreshKey={appointmentsRefreshKey}
          />
        )
      )}
    </div>
  );
};

export default observer(NewAppointment);
