import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agent from 'services/agent';
import StudentSignInHeader from '../StudentSignIn/StudentSignInHeader';
import { useStore } from 'stores/index';
import { InputCertificate } from 'components/Certificate/InputCertificate';

const SendCertificate = ({
  email,
  ine,
  firstNames,
  lastName,
  dateOfBirth,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const {
    commonStore: { config },
  } = useStore();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleSendCertificate = async (e) => {
    e.preventDefault();

    if (!file) {
      setFileError('Merci de joindre un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ine', ine);
    formData.append('firstNames', firstNames);
    formData.append('lastName', lastName);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('email', email);

    try {
      await agent.Student.sendCertificate(formData);
      onSuccess();
    } catch {
      setFileError("Erreur lors de l'envoi du certificat. Merci de réessayer.");
    }
  };

  return (
    <StudentSignInHeader>
      <InputCertificate setFile={setFile} fileError={fileError} />
      <div className="fr-mt-3w fr-btns-group fr-btns-group--inline-md">
        <button
          type="button"
          className="fr-btn"
          onClick={handleSendCertificate}
          disabled={!file}
        >
          Envoyer mon certificat
        </button>
        <button
          type="button"
          className="fr-btn fr-btn--secondary"
          onClick={() => navigate('/')}
        >
          Retour à l&apos;accueil
        </button>
      </div>
      <div>
        <p className="fr-text--sm fr-mb-1v">
          Si tu as des questions{' '}
          <a href={`mailto:${config.contactEmail}`}>contacte le support</a>
        </p>
      </div>
      <a
        href="https://santepsy.etudiant.gouv.fr/eligibilite"
        className="fr-link"
      >
        Refaire le test d&apos;éligibilité
      </a>
    </StudentSignInHeader>
  );
};

export default SendCertificate;
