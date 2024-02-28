export type Inscription = {
    dateDebutInscription: string,
    dateFinInscription: string,
    statut: string,
    regime: string,
    codeCommune: string,
    etablissement: {
      uai: string,
      nom: string
    }
}
