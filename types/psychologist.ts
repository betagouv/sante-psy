import demarchesSimplifiees from '../utils/demarchesSimplifiees';

export type PsychologistState = keyof typeof demarchesSimplifiees.DOSSIER_STATE;

export type EditablePsychologist = {
  email: string,
  address: string,
  departement: string,
  region: string,
  phone: string,
  website: string,
  description: string,
  teleconsultation: boolean,
  languages: string,
  personalEmail: string,
}

export type NonEditablePsychologist = {
  firstNames: string,
  lastName: string,
  archived: boolean,
  state: PsychologistState,
  training: string,
  adeli: string,
  diploma: string,
};

export type Psychologist = NonEditablePsychologist & EditablePsychologist & {
  dossierNumber: string,
  assignedUniversityId: string,
  declaredUniversityId: string,
  isConventionSigned: boolean,
  updatedAt: Date,
  selfModified: boolean,
};
