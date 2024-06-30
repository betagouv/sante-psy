import dbAppointments from '../db/appointments';
import dateUtils from '../utils/date';
import { getAppointmentWithBadges } from '../services/getBadges';
import badges from '../utils/badges';

const monthMap: { [key: string]: number } = {
  janvier: 1,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  décembre: 12,
};

const getMonthNumber = (monthName: string): number | null => monthMap[monthName.toLowerCase()] || null;

const getAppointmentsDetailsByMonth = async (psychologistId, month, year): Promise<void> => {
  console.log('getting appointments details...');
  try {
    const START_CYCLE_DATE = new Date('2023-09-01T00:00:00Z');
    const START_FIRST_DATE = new Date('2024-01-01T00:00:00Z');
    let dateRange = null;
    let selectedPeriod = null;
    if (year && month) {
      const monthNumber = getMonthNumber(month);

      const SEPTEMBER = 9;
      const DECEMBER = 12;

      const selectedYear = parseInt(year.toString());
      const selectedMonth = parseInt(monthNumber.toString());
      const startYear = (selectedMonth >= SEPTEMBER && selectedMonth <= DECEMBER) ? selectedYear : selectedYear - 1;
      const startDate = dateUtils.getUTCDate(new Date(startYear, 8));
      const endDate = dateUtils.getUTCDate(new Date(selectedYear, selectedMonth));

      dateRange = { startDate, endDate };
      selectedPeriod = { year: selectedYear, month: selectedMonth };
    }

    const psychologistaAppointments = await dbAppointments.getAll(
      psychologistId,
      dateRange,
      [{ column: 'patientId' }, { column: 'appointmentDate' }],
    );

    const appointmentsWithBadges = getAppointmentWithBadges(
      psychologistaAppointments,
      false,
      selectedPeriod,
      psychologistId,
    );

    let countFirstBadge = 0;
    let countNoFirstBadge = 0;
    let countExceededBadge = 0;

    appointmentsWithBadges.forEach((appointment) => {
      const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));

      if (appointment.badges.includes(badges.exceeded)) {
        countExceededBadge++;
      } else if (appointment.badges.includes(badges.first)
            && !(appointmentDate >= START_CYCLE_DATE && appointmentDate <= START_FIRST_DATE)) {
        countFirstBadge++;
      } else {
        countNoFirstBadge++;
      }
    });

    console.log('-----Sans comptabilisation INE:');
    console.log('Nombre de première séances:', countFirstBadge);
    console.log('Nombre de séances de suivi:', countNoFirstBadge);
    console.log('Nombre de séances en excès (non visibles sur la facture):', countExceededBadge);

    const appointments = await dbAppointments.getRelatedINEAppointments(psychologistaAppointments, dateRange);

    const appointmentsWithBadgesAndINE = getAppointmentWithBadges(
      appointments,
      false,
      selectedPeriod,
      psychologistId,
    );

    let countFirstBadge2 = 0;
    let countNoFirstBadge2 = 0;
    let countOtherPsychologistBadge2 = 0;
    let countExceededBadge2 = 0;
    const otherPsychologistInfo = { patientIds: [], dates: [] };

    appointmentsWithBadgesAndINE.forEach((appointment) => {
      const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));
      if (appointment.badges.includes(badges.other_psychologist)) {
        countOtherPsychologistBadge2++;
        otherPsychologistInfo.patientIds.push(
          `${appointment.patientId}  ${appointment.lastName}  ${dateUtils.toFormatDDMMYYYY(appointmentDate)}`,
        );
      } else if (appointment.badges.includes(badges.exceeded)) {
        countExceededBadge2++;
      } else if (appointment.badges.includes(badges.first)
            && !(appointmentDate >= START_CYCLE_DATE && appointmentDate <= START_FIRST_DATE)) {
        countFirstBadge2++;
      } else {
        countNoFirstBadge2++;
      }
    });

    console.log(' ');
    console.log('-----Avec comptabilisation INE:');
    console.log('Nombre de première séances:', countFirstBadge2);
    console.log('Nombre de séances de suivi:', countNoFirstBadge2);
    console.log('Nombre de séances en excès (non visible sur la facture):', countExceededBadge2);
    console.log('Nombre de séances que les patients ont eu avec un autre psychologues:', countOtherPsychologistBadge2);
    console.log(' ');
    console.log(
      'Autre psychologue, liste des patients concernés: \n\n',
      otherPsychologistInfo.patientIds.join('\n'),
      '\n',
    );

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
};

const parseArguments = (args: string[]) : {psychologistId: string, month: number, year: number} => {
  const options = {
    psychologistId: null,
    month: null,
    year: null,
  };

  for (let i = 2; i < args.length; i++) {
    switch (args[i]) {
    case '-p':
    case '--psychologistId':
      options.psychologistId = args[++i];
      break;
    case '-m':
    case '--month':
      options.month = args[++i];
      break;
    case '-y':
    case '--year':
      options.year = args[++i];
      break;
    default:
      console.error(`Invalid argument: ${args[i]}`);
      process.exit(1);
    }
  }

  if (!options.psychologistId || !options.month) {
    console.error('Both psychologistId and month are required.');
    process.exit(1);
  }

  return options;
};

const options = parseArguments(process.argv);
getAppointmentsDetailsByMonth(options.psychologistId, options.month, options.year);
