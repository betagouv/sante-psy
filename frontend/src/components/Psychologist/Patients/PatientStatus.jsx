import React from 'react';
import { Alert } from '@dataesr/react-dsfr';
import getBadgeInfos from 'src/utils/badges';

const PatientStatus = ({ patient }) => {
  const badges = getBadgeInfos();

  // Pas de compte étudiant
  if (patient.badges.includes(badges.no_student_account.key)) {
    return (
      <Alert
        type="warning"
        title="Pas de compte étudiant"
        description="L'étudiant doit créer un compte pour bénéficier du dispositif SPE."
      />
    );
  }

  // Non éligible
  if (patient.badges.includes(badges.not_eligible.key)) {
    return (
      <Alert
        type="error"
        title="Non éligible"
        description="Cet étudiant ne semble pas éligible. Une erreur ? Contactez le support."
      />
    );
  }

  // En cours d'instruction
  if (patient.badges.includes(badges.pending_eligibility.key)) {
    return (
      <Alert
        type="info"
        title="En cours d'instruction"
        description="L’éligibilité de cet étudiant est en cours d'instruction. Le statut se mettra à jour automatiquement."
      />
    );
  }

  // Profil incomplet
  if (patient.badges.includes(badges.incomplete_profile.key)) {
    return (
      <Alert
        type="warning"
        title="Profil pas à jour"
        description="L'étudiant doit mettre à jour son compte et télécharger son justificatif de scolarité pour la nouvelle année."
      />
    );
  }

  // Justificatif à valider
  if (patient.badges.includes(badges.check_certif.key)) {
    return (
      <Alert
        type="info"
        title="Justificatif à valider"
        description="Le justificatif de scolarité doit être vérifié et sa validité (année / 
identité) confirmée au moment de la déclaration de la 1ère séance."
      />
    );
  }

  // Profil a jour
  if (patient.badges.includes(badges.completed.key)) {
    return (
      <Alert
        type="success"
        title="À jour"
        description="Vous pouvez déclarer des séances pour cet étudiant."
      />
    );
  }

  return null;
};

export default PatientStatus;
