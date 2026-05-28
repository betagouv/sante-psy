import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@dataesr/react-dsfr';
import { TextInput } from '@dataesr/react-dsfr';
import { Alert } from '@dataesr/react-dsfr';
import ErrorMessage from 'components/Forms/ErrorMessage';
import { validateEmailField } from 'src/utils/validateEmailFormat';

const InviteStudent = () => {
  const emailRef = useRef();

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const [inviteEmail, setInviteEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const cleanInviteEmail = useMemo(
    () => inviteEmail.trim().toLowerCase(),
    [inviteEmail],
  );
  const canInvite = useMemo(
    () => cleanInviteEmail && !emailError,
    [cleanInviteEmail, emailError],
  );

  useEffect(() => {
    if (!cleanInviteEmail) {
      setEmailError('');
      return;
    }
    validateEmailField(cleanInviteEmail, setEmailError);
  }, [cleanInviteEmail]);

  return (
    <>
      <Alert
        type="warning"
        description="L'étudiant que vous recherchez ne semble pas avoir créé de compte. Invitez le en entrant son email ci-dessous"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('invite student');
        }}
      >
        <TextInput
          label="Email de l'étudiant"
          ref={emailRef}
          className="midlength-input"
          data-test-id="email-input"
          value={inviteEmail}
          type="email"
          onChange={(e) => setInviteEmail(e.target.value)}
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
    </>
  );
};

export default InviteStudent;
