import patients from '../db/patients';
import appointments from '../db/appointments';
import psychologists from '../db/psychologists';
import dateUtils from '../utils/date';

interface StudentAppointment {
  univYear: string;
  appointmentDate: string;
  psychologistName: string;
}

// TODO unit tests please
const getStudentAppointments = async (
  email: string,
  INE: string,
): Promise<Record<string, StudentAppointment[]>> => {
  const matchedPatients = await patients.getByStudentEmailAndIne(email, INE);

  if (matchedPatients.length === 0) {
    return {};
  }

  const appointmentsArrays = await Promise.all(
    matchedPatients.map((patient) => appointments.getByPatientId(patient.id, true)),
  );

  const flatAppointments = appointmentsArrays.flat();

  if (flatAppointments.length === 0) {
    return {};
  }

  const uniqueAppointments = Array.from(
    new Map(flatAppointments.map((appt) => [appt.id, appt])).values(),
  );

  const psychologistIds = [
    ...new Set(uniqueAppointments.map((appt) => appt.psychologistId)),
  ];

  const psychologistsArray = await Promise.all(
    psychologistIds.map((id) => psychologists.getById(id)),
  );

  const psychologistNameById = psychologistsArray.reduce<Record<string, string>>(
    (acc, psy) => {
      if (psy) {
        acc[psy.dossierNumber] = `${psy.useFirstNames || psy.firstNames} ${psy.useLastName || psy.lastName}`;
      }
      return acc;
    },
    {},
  );

  const mappedAppointments: StudentAppointment[] = uniqueAppointments
  .map((appt) => ({
    univYear: appt.univYear || 'unknown',
    appointmentDate: appt.appointmentDate,
    psychologistName:
      psychologistNameById[appt.psychologistId]
      ?? 'Psychologue inconnu',
  }))
  .sort(
    (a, b) => new Date(a.appointmentDate).getTime()
      - new Date(b.appointmentDate).getTime(),
  );

  return mappedAppointments.reduce<Record<string, StudentAppointment[]>>(
    (acc, appointment) => {
      if (!acc[appointment.univYear]) {
        acc[appointment.univYear] = [];
      }

      acc[appointment.univYear].push({
        univYear: appointment.univYear,
        appointmentDate: dateUtils.formatFrenchDate(
          new Date(appointment.appointmentDate),
        ),
        psychologistName: appointment.psychologistName,
      });

      return acc;
    },
    {},
  );
};

export default {
  getStudentAppointments,
};
