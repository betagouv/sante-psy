import { DossierState } from './DossierState';

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
  };

export type NonEditablePsychologist = {
    firstNames: string,
    lastName: string,
    archived: boolean,
    state: DossierState,
    training: string,
    adeli: string,
    diploma: string,
  };

export type Psychologist = NonEditablePsychologist & EditablePsychologist & {
    dossierNumber: string,
    assignedUniversityId: string,
    isConventionSigned?: boolean,
    selfModified?: boolean,
    active: boolean,
    inactiveUntil: string,
    // loginEmail: string,
    updatedAt: Date,
    createdAt: Date,
  };

export type DSPsychologist = {
  id: string,
  state: DossierState,
  archived: boolean,
  usager: {
    email: string,
  },
  number: number,
  groupeInstructeur: {
    label: string
  },
  demandeur: {
    nom: string,
    prenom: string,
  },
  messages: string[],
  annotations: {
    id: string,
    stringValue: string,
  }[]
  champs: {
    id: string,
    stringValue: string,
  }[],
}
