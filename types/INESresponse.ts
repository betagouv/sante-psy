export type StatutApt4 = 'EN_ATTENTE' | 'VALIDÉ' | 'REFUSÉ';

export class RetourDemandeVerificationApt4 {
  nomFamille?: string;

  nomUsage?: string;

  prenom1?: string;

  prenom2?: string;

  prenom3?: string;

  sexe?: 'H' | 'F';

  dateNaissance?: string;

  lieuNaissance?: string;

  ineMaitre?: string;

  etatDemande: StatutApt4[];
}
