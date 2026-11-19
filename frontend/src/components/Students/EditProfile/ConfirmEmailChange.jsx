import React, { useEffect, useState } from 'react';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { useNavigate, useParams } from 'react-router-dom';
import agent from 'services/agent';
import { useStore } from 'stores/';

const ConfirmEmailChange = () => {
  const {
    commonStore: { config },
  } = useStore();
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
        setTokenError(
          "Ce lien est invalide ou a expiré. Refais une demande de changement d'email depuis ton espace.",
        );
      }
    };
    fetchPendingEmail();
  }, [token]);

  const handleSubmit = async (e) => {
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
        setError(
          'Trop de tentatives. Ta demande a été annulée. Contacte le support si besoin.',
        );
      } else {
        setError('La date de naissance est incorrecte. Vérifie et recommence.');
      }
    }
  };

  if (tokenError) {
    return (
      <Alert
        severity="error"
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
          severity="success"
          title="Ton email a bien été vérifié."
          description="Tu devras désormais utiliser ton nouvel email pour te connecter."
        />
        <Button
          onClick={() => navigate('/etudiant/mes-seances')}
          priority="secondary"
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
        <strong>{pendingEmail}</strong>. Pour finaliser le changement, indique
        ta date de naissance.
      </p>

      <Input
        className="midlength-input"
        label="Nouvelle adresse email"
        nativeInputProps={{
          value: pendingEmail,
          disabled: true,
          'aria-readonly': true,
        }}
      />

      <Input
        className="midlength-input"
        label="Date de naissance"
        hintText="Renseigne la date de naissance associée à ton compte"
        nativeInputProps={{
          value: dateOfBirth,
          onChange: (e) => setDateOfBirth(e.target.value),
          type: 'date',
          required: true,
          disabled: tooManyAttempts,
        }}
      />

      {error && (
        <Alert
          className="fr-mt-2w fr-mb-2w"
          severity="error"
          description={error}
        />
      )}

      <div className="fr-btns-group fr-btns-group--inline-sm fr-mt-3w">
        <Button
          nativeButtonProps={{ type: 'submit' }}
          disabled={tooManyAttempts || !dateOfBirth || !hasChangedDob}
        >
          Confirmer le changement
        </Button>
        <Button
          onClick={() => navigate('/etudiant/mes-seances')}
          priority="secondary"
          iconId="fr-icon-close-line"
        >
          Annuler la modification
        </Button>
      </div>
    </form>
  );
};

export default ConfirmEmailChange;
