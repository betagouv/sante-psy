import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import ErrorMessage from 'components/Forms/ErrorMessage';
import { validateEmailField } from 'src/utils/validateEmailFormat';
import { Stack } from 'components/Utils/Stack';
import agent from 'services/agent';

const InviteStudent = ({ cancelInvite }) => {
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
        <Alert
          severity="success"
          title=""
          description="L'invitation a bien été envoyée"
        />
      ) : (
        !invitationSent && (
          <Alert
            severity="warning"
            title=""
            description="L'étudiant que vous recherchez ne semble pas avoir créé de compte. Invitez le en entrant son email ci-dessous"
          />
        )
      )}

      <form onSubmit={inviteStudent}>
        <Input
          label="Email de l'étudiant"
          ref={emailRef}
          className="midlength-input"
          nativeInputProps={{
            'data-test-id': 'email-input',
            value: inviteEmail,
            type: 'email',
            onChange: (e) => setInviteEmail(e.target.value),
            disabled: invitationSent,
          }}
        />
        {emailError && (
          <ErrorMessage
            message={emailError}
            data-test-id="invite-etudiant-email-error"
          />
        )}
        <ButtonsGroup
          inlineLayoutWhen="always"
          buttons={[
            {
              children: 'Annuler',
              priority: 'secondary',
              onClick: cancelInvite,
            },
            {
              children: "Inviter l'étudiant",
              nativeButtonProps: {
                type: 'submit',
                id: 'invite-student-button',
                'data-test-id': 'invite-student-button',
                disabled: !canInvite,
              },
            },
          ]}
        />
      </form>
    </Stack>
  );
};

export default InviteStudent;
