import React, { useEffect, useState } from 'react';
import { Alert } from '@dataesr/react-dsfr';
import agent from 'services/agent';

const DEFAULT_STYLE = { width: '100%', height: '80vh' };

const NewAppointmentSeeCertificate = ({
  studentId,
  univYear,
  style,
  className,
}) => {
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [certificateNotFound, setCertificateNotFound] = useState(false);
  useEffect(() => {
    let objectUrl = null;
    setCertificateNotFound(false);

    const fetchCertificate = async () => {
      try {
        const res = await agent.Psychologist.seeCertificate(
          univYear,
          studentId,
        );
        objectUrl = URL.createObjectURL(res); // res IS the blob directly
        setCertificateUrl(objectUrl);
      } catch (err) {
        if (err.response?.status === 404) {
          setCertificateNotFound(true);
        } else {
          console.error('Failed to load certificate', err);
        }
      }
    };

    fetchCertificate();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [univYear, studentId]);

  if (certificateNotFound) {
    return <Alert type="info" title="Aucun certificat n'a été trouvé" />;
  }

  const resolvedStyle = className ? style : { ...DEFAULT_STYLE, ...style };

  return (
    certificateUrl && (
      <iframe
        src={certificateUrl}
        title="Certificat étudiant"
        className={className}
        style={{ border: 'none', ...resolvedStyle }}
      />
    )
  );
};

export default NewAppointmentSeeCertificate;
