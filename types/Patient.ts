export type Patient = {
    id:string,
    firstNames: string,
    lastName: string,
    INE: string,
    institutionName: string,
    isStudentStatusVerified: boolean,
    hasPrescription: boolean,
    psychologistId: string,
    doctorName: string,
    doctorAddress: string,
    dateOfBirth: Date | null,
}
