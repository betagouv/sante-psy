import React, { useState } from 'react';
import { Button, Alert, Icon } from '@dataesr/react-dsfr';
import { useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import agent from 'services/agent';
import Notification from 'components/Notification/Notification';

const SendPatientCertificate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // TODO dans PR certif le psyId doit venir de la req, pas des params
  const { patientId, patientName, psychologistId } = location.state || {};


  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [certificateSent, setCertificateSent] = useState(false);

  if (!patientId || !patientName) {
    navigate('/psychologue/mes-etudiants');
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    formData.append('psychologistId', psychologistId);

    try {
      await agent.Patient.sendCertificate(formData);
      setCertificateSent(true);
    } catch (err) {
      setError("Erreur lors de l'envoi du certificat. Veuillez réessayer.");
    }
  };

  return (
    <div className="fr-container fr-my-4w">
      <h1>{patientName}</h1>
      {certificateSent ? (
        <div>
          <Notification type="success">
            <b>L&apos;INE non valide sera vérifié.</b>
            <br />
            Ce numéro sera utilisé pour comptabiliser des séances pour l&apos;étudiant. Vous pouvez dès à présent déclarer des séances.
          </Notification>
          <HashLink
            to="/psychologue/nouvelle-seance"
            className="fr-btn"
          >
            <div data-test-id="new-appointment-button">
              <Icon name="ri-add-line" />
              Nouvelle séance
            </div>
          </HashLink>
        </div>
      ) : (
        <div>
          <h2 className="fr-mt-3w">Ajouter un certificat de scolarité</h2>
          <p>Vous certifiez que le numéro INE indiqué est celui montré par l&apos;étudiant.</p>
          <p>Veuillez joindre une copie du certificat de scolarité de l&apos;étudiant :</p>

          {error && <Alert type="error" title="Erreur">{error}</Alert>}

          <div className="fr-my-2w">
            <label className="fr-label" htmlFor="file-upload">Ajouter un fichier (.jpg, .pdf, .png)</label>
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
            <Button onClick={handleSubmit} disabled={!file}>
              Envoyer le certificat de scolarité
            </Button>
            <Button secondary onClick={() => navigate('/psychologue/mes-etudiants')}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendPatientCertificate;
