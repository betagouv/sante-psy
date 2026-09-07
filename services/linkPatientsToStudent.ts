import dbPatients from '../db/patients';

const linkPatientsToStudent = async (
  student: { id: string; ine: string; lastName: string; firstNames: string },
): Promise<void> => {
  const matchedPatients = await dbPatients.findUnlinkedMatches(
    student.ine,
    student.lastName,
    student.firstNames,
  );

  await Promise.all(
    matchedPatients.map((patient) =>
      dbPatients.linkToStudent(patient.id, student.id),
    ),
  );
};

export default linkPatientsToStudent;
