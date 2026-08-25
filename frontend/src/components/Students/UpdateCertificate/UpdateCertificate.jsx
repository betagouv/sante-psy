import React, { useState } from 'react';
import Page from 'components/Page/Page';
import { useStore } from 'stores/index';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import agent from 'services/agent';
import { getUnivYear } from 'services/univYears';
import { InputCertificate } from 'components/Certificate/InputCertificate';
const UpdateCertificate = () => {
  const {
    userStore: { user, role, pullUser },
  } = useStore();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  if (!user || role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  if (!user.needsToUploadCertificate) {
    return <Navigate to="/login" replace />;
  }

  const handleSendCertificate = async (e) => {
    e.preventDefault();

    if (!file) {
      setFileError('Merci de joindre un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await agent.Student.updateCertificate(
        user.id,
        getUnivYear(new Date(), '-'),
        formData,
      );
      await pullUser();
      navigate('/etudiant');
    } catch {
      setFileError("Erreur lors de l'envoi du certificat. Merci de réessayer.");
    }
  };

  return (
    <Page
      title={
        <>
          Rentrée 2026 : mets à jour ton <b>espace étudiant</b>
        </>
      }
      description="D'une année à l'autre, ta situation peut changer : on fait le point avec toi."
    >
      <div>
        <InputCertificate setFile={setFile} fileError={fileError} />
        <button
          type="button"
          className="fr-btn"
          onClick={handleSendCertificate}
          disabled={!file}
        >
          Envoyer mon certificat
        </button>
      </div>
    </Page>
  );
};

export default UpdateCertificate;
