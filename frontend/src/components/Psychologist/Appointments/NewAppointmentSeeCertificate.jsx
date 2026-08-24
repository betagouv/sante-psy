import React, { useEffect, useState } from 'react';
import { Alert } from '@dataesr/react-dsfr';
import agent from 'services/agent';

const NewAppointmentSeeCertificate = ({ studentId, univYear }) => {
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [certificateNotFound, setCertificateNotFound] = useState(false);
  useEffect(() => {
    let objectUrl = null;
    setCertificateLoading(true);
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
    return <Alert type="info">Aucun certificat n'a été trouvé</Alert>;
  }

  return (
    certificateUrl && (
      <iframe
        src={certificateUrl}
        title="Certificat étudiant"
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    )
  );
};

export default NewAppointmentSeeCertificate;
