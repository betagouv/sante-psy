import { DossierState } from './DossierState';
import { Coordinates } from './Coordinates';

export type EditablePsychologist = Coordinates & {
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
    assignedUniversityId: string,
  };

export type Psychologist = NonEditablePsychologist & EditablePsychologist & {
    dossierNumber: string,
    isConventionSigned?: boolean,
    selfModified?: boolean,
    active: boolean,
    inactiveUntil: Date,
    updatedAt?: Date,
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
  }[],
  champs: {
    id: string,
    stringValue: string,
  }[],
}
