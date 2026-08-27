export type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PENDING';

export type Eligibility = {
  status: EligibilityStatus;
  isProfileComplete: boolean;
  canPsyDeclareAppointment: boolean;
};
