export type Patient = {
    id:string,
    firstNames: string,
    lastName: string,
    INE?: string,
    gender: string,
    institutionName?: string,
    isStudentStatusVerified?: boolean,
    psychologistId: string,
    doctorName?: string,
    dateOfBirth?: Date,
    deleted?: boolean,
    updatedAt?: Date,
    renewed?: boolean // Deprecated: used on 2022/2023 only
    appointmentsYearCount?: string,
    appointmentsCount?: string,
    countedAppointments?: string,
    badges?: string[],
}
