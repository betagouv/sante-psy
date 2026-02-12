import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SendCertificate from './SendCertificate';

const StudentSendCertificate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, ine, firstNames, lastName, dateOfBirth } = location.state || {};

  if (!email || !ine) {
    navigate('/inscription');
    return null;
  }

  return (
    <SendCertificate
      email={email}
      ine={ine}
      firstNames={firstNames}
      lastName={lastName}
      dateOfBirth={dateOfBirth}
      onSuccess={() => navigate('/inscription/certificat/success')}
    />
  );
};

export default StudentSendCertificate;
