import React from 'react';
import Page from 'components/Page/Page';
import { useNavigate } from 'react-router-dom';

const SuccessMessage = () => {
  const navigate = useNavigate();

  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title="Inscription validée"
      >
      <div className="fr-alert fr-alert--success fr-mb-3w">
        <h3 className="fr-alert__title">Ton inscription a bien été validée !</h3>
        <p>
          Tu as reçu un email de connexion pour accéder à ton Espace Étudiant.
          <br />
          Pense à vérifier tes spams si tu ne le vois pas tout de suite.
        </p>
      </div>
      <div className="fr-mt-3w">
        <button type="button" className="fr-btn" onClick={() => navigate('/')}>
          Accéder à l&apos;accueil
        </button>
      </div>
    </Page>
  );
};

export default SuccessMessage;
