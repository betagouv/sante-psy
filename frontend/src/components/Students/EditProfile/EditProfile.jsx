import React, { useEffect, useMemo, useState } from 'react';
import { Button, TextInput, ButtonGroup, Alert } from '@dataesr/react-dsfr';
import { useNavigate , Link } from 'react-router-dom';
import agent from 'services/agent';
import { useStore } from 'stores/';
import styles from './editProfile.cssmodule.scss';

const EditProfile = () => {
  const navigate = useNavigate();
  const { commonStore: { config }, userStore: { user, pullUser } } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState('form');
  const [newEmail, setNewEmail] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(null);
  const [hasChangedEmail, setHasChangedEmail] = useState(false);

  const cleanNewEmail = useMemo(() => newEmail.trim().toLowerCase(), [newEmail]);

  useEffect(() => setHasChangedEmail(!!cleanNewEmail), [cleanNewEmail]);

  useEffect(() => {
    const load = async () => {
      await pullUser();
      setIsLoaded(true);
    };
    load();
  }, [pullUser]);
  
  if (!isLoaded) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      await agent.Student.requestEmailChange(newEmail);
      setStep('pending');
    } catch (err) {
      setHasChangedEmail(false);
      const next = attempts + 1;
      setAttempts(next);
      if (next >= config.maxValidEmailAttempts) {
        setError('Trop de tentatives. Contacte le support pour modifier ton adresse email.');
      } else if (err.response?.data?.code === 'SAME_EMAIL') {
        setError("Cette adresse est identique à ton adresse actuelle.");
      } else {
          setError(
            "Une erreur est survenue, vérifie l'email entré et recommence",
          );
        }
      };
    }

  if (step === 'pending') {
    return (
      <div>
        <p className={`fr-text--lead ${styles.mailTitle}`}>Consulte ta boîte mail</p>
        <p>
          Un email de validation vient d&apos;être envoyé à <b>{newEmail}</b>.
        </p>
        <p>Clique sur le lien dans l&apos;email pour continuer.</p>
        <p>Tu dois être connecté à ton compte pour que la modification soit prise en compte.</p>
        <Button
          onClick={() => navigate('/etudiant/mes-seances')}
          secondary
          className="fr-mt-3w"
        >
          Retour à mes séances
        </Button>
      </div>
    );
  }

  const tooManyAttempts = attempts >= config.maxValidEmailAttempts;

  return (
    <form onSubmit={handleSubmit}>
      <p className="fr-mb-3w">Voici les informations te concernant :</p>
      <TextInput
        className="midlength-input"
        label="INE (non modifiable)"
        hint="Si ton INE change, tu dois recréer un compte"
        value={user.ine}
        disabled
        aria-readonly="true"
      />
      <TextInput
        className="midlength-input"
        label="Adresse email actuelle (non modifiable)"
        value={user.email}
        disabled
        aria-readonly="true"
      />
      <TextInput
        className="midlength-input"
        label="Nouvelle adresse email"
        value={newEmail}
        onChange={e => setNewEmail(e.target.value.toLowerCase())}
        type="email"
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

      <p className="fr-mt-3w">
        N&apos;oublie pas de prévenir ton psychologue si tu changes ton adresse email.
      </p>

      <p>
          <em>Tu souhaites supprimer ton compte ? <Link to="/contact">Contacte-nous</Link></em>
      </p>

      <ButtonGroup isInlineFrom="xs" className="fr-mt-3w">
        <Button
          onClick={() => navigate('/etudiant/mes-seances')}
          secondary
        >
          Annuler
        </Button>
        <Button
          submit
          disabled={tooManyAttempts || !newEmail || !hasChangedEmail}
        >
          Valider la modification
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default EditProfile;
