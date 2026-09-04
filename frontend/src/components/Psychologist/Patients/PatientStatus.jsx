import React from 'react';
import { Alert } from '@dataesr/react-dsfr';
import getBadgeInfos from 'src/utils/badges';

export const StatusNoStudentAccount = () => (
  <Alert
    type="warning"
    className="fr-my-3w"
    title="Pas de compte étudiant"
    description="L'étudiant doit créer un compte pour bénéficier du dispositif SPE."
  />
);

export const StatusNotEligible = () => (
  <Alert
    type="error"
    className="fr-my-3w"
    title="Non éligible"
    description="Cet étudiant ne semble pas éligible. Une erreur ? Contactez le support."
  />
);

export const StatusPendingEligibility = () => (
  <Alert
    type="info"
    className="fr-my-3w"
    title="En cours d'instruction"
    description="L’éligibilité de cet étudiant est en cours d'instruction. Le statut se mettra à jour automatiquement."
  />
);

export const StatusIncompleteProfile = () => (
  <Alert
    type="warning"
    className="fr-my-3w"
    title="Profil pas à jour"
    description="L'étudiant doit mettre à jour son compte et télécharger son justificatif de scolarité pour la nouvelle année."
  />
);

export const StatusCheckCertif = () => (
  <Alert
    type="info"
    className="fr-my-3w"
    title="Justificatif à valider"
    description="Le justificatif de scolarité doit être vérifié et sa validité (année / 
identité) confirmée au moment de la déclaration de la 1ère séance."
  />
);

export const StatusUpToDate = () => (
  <Alert
    type="success"
    className="fr-my-3w"
    title="À jour"
    description="Vous pouvez déclarer des séances pour cet étudiant."
  />
);

const PatientStatus = ({ patient }) => {
  const badges = getBadgeInfos();

  // Pas de compte étudiant
  if (patient.badges.includes(badges.no_student_account.key)) {
    return <StatusNoStudentAccount />;
  }

  // Non éligible
  if (patient.badges.includes(badges.not_eligible.key)) {
    return <StatusNotEligible />;
  }

  // En cours d'instruction
  if (patient.badges.includes(badges.pending_eligibility.key)) {
    return <StatusPendingEligibility />;
  }

  // Profil incomplet
  if (patient.badges.includes(badges.incomplete_profile.key)) {
    return <StatusIncompleteProfile />;
  }

  // Justificatif à valider
  if (patient.badges.includes(badges.check_certif.key)) {
    return <StatusCheckCertif />;
  }

  // Profil a jour
  if (patient.badges.includes(badges.completed.key)) {
    return <StatusUpToDate />;
  }

  return null;
};

export default PatientStatus;
