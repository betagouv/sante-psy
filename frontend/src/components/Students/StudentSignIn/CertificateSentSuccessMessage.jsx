import React from 'react';
import Page from 'components/Page/Page';
import { useNavigate } from 'react-router-dom';

const CertificateSentSuccessMessage = () => {
  const navigate = useNavigate();

  return (
    <Page
      withStats
      title="Certificat envoyé"
      >
      <div className="fr-alert fr-alert--success fr-mb-3w">
        <h3 className="fr-alert__title">Certificat envoyé</h3>
        <p>Le support Santé Psy Étudiant doit vérifier ton accès à l&apos;espace étudiant. Tu peux déjà te connecter</p>
      </div>
      <p>Consulte tes mails pour te connecter à ton espace</p>
      <div className="fr-mt-3w">
        <button type="button" className="fr-btn fr-btn--secondary" onClick={() => navigate('/')}>
          Retour à l&apos;accueil
        </button>
      </div>
    </Page>
  );
};

export default CertificateSentSuccessMessage;
