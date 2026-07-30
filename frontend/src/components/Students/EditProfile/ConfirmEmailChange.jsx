import React, { useEffect, useState } from 'react';
import { Button, TextInput, Alert } from '@dataesr/react-dsfr';
import { useNavigate, useParams } from 'react-router-dom';
import agent from 'services/agent';
import { useStore } from 'stores/';

const ConfirmEmailChange = () => {
  const { commonStore: { config }} = useStore();
  const navigate = useNavigate();
  const { token } = useParams();

  const [pendingEmail, setPendingEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(null);
  const [tokenError, setTokenError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [hasChangedDob, setHasChangedDob] = useState(false);

  useEffect(() => setHasChangedDob(!!dateOfBirth), [dateOfBirth]);

  useEffect(() => {
    const fetchPendingEmail = async () => {
      try {
        const response = await agent.Student.getEmailChangeRequest(token);
        setPendingEmail(response.pendingEmail);
      } catch {
        setTokenError('Ce lien est invalide ou a expiré. Refais une demande de changement d\'email depuis ton espace.');
      }
    };
    fetchPendingEmail();
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setHasChangedDob(false);

    try {
      await agent.Student.confirmEmailChange(token, { dateOfBirth });
      setConfirmed(true);
    } catch {
      const next = attempts + 1;
      setAttempts(next);

      if (next >= config.maxValidEmailAttempts) {
        await agent.Student.deleteEmailChangeInfo(token).catch(() => {});
        setError('Trop de tentatives. Ta demande a été annulée. Contacte le support si besoin.');
      } else {
        setError(
          'La date de naissance est incorrecte. Vérifie et recommence.',
        );
      }
    }
  };

  if (tokenError) {
    return (
      <Alert
        type="error"
        title="Lien invalide ou expiré"
        description={tokenError}
      />
    );
  }

  if (confirmed) {
    return (
      <div>
        <Alert
          className="fr-mb-3w"
          type="success"
          title="Ton email a bien été vérifié."
          description="Tu devras désormais utiliser ton nouvel email pour te connecter."
        />
        <Button
          onClick={() => navigate('/etudiant/mes-seances')}
          secondary
        >
          Retour à mes séances
        </Button>
      </div>
    );
  }

  const tooManyAttempts = attempts >= config.maxValidEmailAttempts;

  return (
    <form onSubmit={handleSubmit}>
      <p className="fr-mb-3w">
        Un lien de vérification a été envoyé à ta nouvelle adresse{' '}
        <strong>{pendingEmail}</strong>. Pour finaliser le changement, indique ta date de naissance.
      </p>

      <TextInput
        className="midlength-input"
        label="Nouvelle adresse email"
        value={pendingEmail}
        disabled
        aria-readonly="true"
      />

      <TextInput
        className="midlength-input"
        label="Date de naissance"
        hint="Renseigne la date de naissance associée à ton compte"
        value={dateOfBirth}
        onChange={e => setDateOfBirth(e.target.value)}
        type="date"
        required
        disabled={tooManyAttempts}
      />

      {error && (
        <Alert
          className="fr-mt-2w fr-mb-2w"
          type="error"
          description={error}
        />
      )}

      <div className="fr-btns-group fr-btns-group--inline-sm fr-mt-3w">
        <Button
          submit
          disabled={tooManyAttempts || !dateOfBirth || !hasChangedDob}
        >
          Confirmer le changement
        </Button>
        <Button
          onClick={() => navigate('/etudiant/mes-seances')}
          secondary
          icon="fr-fi-close-line"
        >
          Annuler la modification
        </Button>
      </div>
    </form>
  );
};

export default ConfirmEmailChange;
