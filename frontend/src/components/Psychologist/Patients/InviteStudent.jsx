import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@dataesr/react-dsfr';
import { TextInput } from '@dataesr/react-dsfr';
import { Alert } from '@dataesr/react-dsfr';
import ErrorMessage from 'components/Forms/ErrorMessage';
import { validateEmailField } from 'src/utils/validateEmailFormat';
import { Stack } from 'components/Utils/Stack';
import agent from 'services/agent';

const InviteStudent = () => {
  const emailRef = useRef();

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const [inviteEmail, setInviteEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [invitationSent, setInvitationSent] = useState(false);
  const [invitationSuccess, setInvitationSuccess] = useState(false);

  const cleanInviteEmail = useMemo(
    () => inviteEmail.trim().toLowerCase(),
    [inviteEmail],
  );
  const canInvite = useMemo(
    () => cleanInviteEmail && !emailError && !invitationSent,
    [cleanInviteEmail, emailError, invitationSent],
  );

  useEffect(() => {
    if (!cleanInviteEmail) {
      setEmailError('');
      return;
    }
    validateEmailField(cleanInviteEmail, setEmailError);
  }, [cleanInviteEmail]);

  const inviteStudent = async (e) => {
    e.preventDefault();
    try {
      await agent.Psychologist.inviteStudent({
        email: cleanInviteEmail,
      });
      setInvitationSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setInvitationSent(true);
  };

  return (
    <Stack>
      {invitationSuccess ? (
        <Alert type="success" description="L'invitation a bien été envoyée" />
      ) : (
        !invitationSent && (
          <Alert
            type="warning"
            description="L'étudiant que vous recherchez ne semble pas avoir créé de compte. Invitez le en entrant son email ci-dessous"
          />
        )
      )}

      <form onSubmit={inviteStudent}>
        <TextInput
          label="Email de l'étudiant"
          ref={emailRef}
          className="midlength-input"
          data-test-id="email-input"
          value={inviteEmail}
          type="email"
          onChange={(e) => setInviteEmail(e.target.value)}
          disabled={invitationSent}
        />
        {emailError && (
          <ErrorMessage
            message={emailError}
            data-test-id="invite-etudiant-email-error"
          />
        )}
        <Button
          submit
          id="invite-student-button"
          data-test-id="invite-student-button"
          disabled={!canInvite}
        >
          Inviter l'étudiant
        </Button>
      </form>
    </Stack>
  );
};

export default InviteStudent;
