import React, { useEffect, useState } from 'react';
import agent from 'services/agent';
import StudentSignInHeader from './StudentSignInHeader';
import { validateEmailFormat } from 'src/utils/validateEmailFormat';
import { TextInput } from 'components/Forms/TextInput';

const StudentSignInStepOne = () => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState('');
  const [notification, setNotification] = useState(null);
  const [canSendEmail, setCanSendEmail] = useState(true);

  useEffect(() => setCanSendEmail(!!email && emailValid), [email, emailValid]);

  const sendStudentSecondStepMail = async (e) => {
    setCanSendEmail(false);
    e.preventDefault();
    if (!emailValid) return;

    try {
      setCanSendEmail(false);
      const response = await agent.Student.sendStudentSecondStepMail(email);
      setNotification({ type: 'success', message: response.message });
    } catch (error) {
      setNotification({
        type: 'error',
        message: "Une erreur est survenue lors de l'inscription.",
      });
    }
  };

  return (
    <StudentSignInHeader description="Ton identifiant sera ton email">
      <form onSubmit={sendStudentSecondStepMail}>
        {notification && (
          <div
            className={`fr-alert fr-alert--${notification.type} fr-mt-3w`}
            role="alert"
          >
            <h3 className="fr-alert__title">{notification.message}</h3>
            {notification.type === 'success' && (
              <p>
                Un email de validation vient de t&apos;être envoyé si ton
                adresse email est correcte et n&apos;a pas déjà été utilisée
                pour un autre compte.
                <br />
                Si tu suspectes une usurpation ou une erreur, ou si tu
                rencontres des difficultés pour créer ton compte, tu peux nous
                contacter via le{' '}
                <a
                  href="https://santepsy.etudiant.gouv.fr/contact/formulaire"
                  className="fr-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  formulaire de contact
                </a>
                .
              </p>
            )}
          </div>
        )}
        <div className="fr-my-2w">
          <TextInput
            id="email"
            disabled={false}
            fieldName="addresse e-mail"
            label="Ton email"
            hint="Utilise une adresse email personnelle. Elle te suivra même si tu changes de formation ou d'établissement."
            setValid={setEmailValid}
            setValue={setEmail}
            validator={validateEmailFormat}
            formatter={(s) => s.toLowerCase()}
          />
        </div>

        <div className="fr-my-4w">
          <button
            className="fr-btn"
            type="submit"
            disabled={!canSendEmail || !emailValid}
          >
            Suivant
          </button>
        </div>
      </form>
    </StudentSignInHeader>
  );
};

export default StudentSignInStepOne;
