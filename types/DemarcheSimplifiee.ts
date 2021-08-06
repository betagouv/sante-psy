import { DSPsychologist } from './Psychologist';

export type DSResponse = {
    demarche: {
      dossiers: {
        pageInfo: {
          hasNextPage: boolean,
          endCursor: string
        },
        nodes: DSPsychologist[]
      }
    }
  }

export type GroupeInstructeur = {
    id: string,
    number: number,
    label: string,
    instructeurs: {
      id: string,
      email: string
    }[]
  }

export type FileInfo = {
    filename: string,
    byteSize: number,
    checksum: string,
    contentType: string
  }
