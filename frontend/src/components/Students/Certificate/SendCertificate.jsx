import React, { useState } from 'react';
import Page from 'components/Page/Page';
import { useNavigate } from 'react-router-dom';
import agent from 'services/agent';

const SendCertificate = ({
  email,
  ine,
  firstNames,
  lastName,
  dateOfBirth,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleSendCertificate = async e => {
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
    <Page
      withStats
      title={(
        <>
          Inscription à ton
          {' '}
          <b>Espace Étudiant</b>
        </>
      )}
    >
      <h2 className="fr-mt-3w">Ton accès doit être vérifié</h2>
      <img src="/images/icons/file.svg" alt="" />
      <p className="fr-mb-1v">Ajoute ton certificat de scolarité ou ton attestation CVEC</p>
      <p>Ton numéro INE doit y être inscrit</p>
      {fileError
      && (
      <div className="fr-alert fr-alert--error fr-mb-2w">
        <h3 className="fr-alert__title">Erreur</h3>
        <p>{fileError}</p>
      </div>
      )}
      <div className="fr-my-2w">
        <label className="fr-label" htmlFor="file-upload">
          Ajouter un fichier (.jpg, .pdf, .png)
        </label>
        <input
          className="fr-input"
          id="file-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          placeholder="Formats supportés : .jpg, .png, .pdf. Un seul fichier possible."
          onChange={e => setFile(e.target.files[0])}
        />
      </div>

      <div className="fr-mt-3w fr-btns-group fr-btns-group--inline-md">
        <button type="button" className="fr-btn" onClick={handleSendCertificate} disabled={!file}>
          Envoyer mon certificat
        </button>
        <button type="button" className="fr-btn fr-btn--secondary" onClick={() => navigate('/')}>
          Retour à l&apos;accueil
        </button>
      </div>
      <div>
        <p className="fr-text--sm fr-mb-1v">
          Le support Santé Psy Étudiant doit vérifier ton accès à l&apos;espace étudiant.
        </p>
        <p className="fr-text--sm fr-mb-1v">
          Ton numéro INE doit être inscrit sur le document. Il comporte 11 chiffres ou lettres.
        </p>
        <p className="fr-text--sm fr-mb-1v">
          Si tu ne le trouves pas, il est sur ton attestation CVEC.
        </p>
        <p className="fr-text--sm">
          Si tu n&apos;as pas ces éléments, il se peut que tu ne sois pas éligible. Vérifie auprès de ton établissement scolaire.
        </p>
      </div>
      <a
        href="https://santepsy.etudiant.gouv.fr/eligibilite"
        className="fr-link"
      >
        Refaire le test d&apos;éligibilité
      </a>
    </Page>
  );
};

export default SendCertificate;
