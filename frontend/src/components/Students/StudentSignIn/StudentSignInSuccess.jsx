import React from 'react';
import Page from 'components/Page/Page';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentSignInSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isEligible } = location.state || {};

  const title = isEligible
    ? 'Ton inscription a bien été validée !'
    : 'Ton éligibilité est en cours d’instruction';
  const desc = isEligible ? (
    <>
      Tu as reçu un email de connexion pour accéder à ton Espace Étudiant.
      <br />
      Pense à vérifier tes spams si tu ne le vois pas tout de suite.
    </>
  ) : (
    <>
      L’équipe SPE vérifie ton éligibilité.
      <br />
      Tu recevras un email pour te dire si ton inscription au dispositif SPE est
      validée ou non.
    </>
  );
  return (
    <Page withStats title="Inscription validée">
      <div className="fr-alert fr-alert--success fr-mb-3w">
        <h3 className="fr-alert__title">{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="fr-mt-3w">
        <button type="button" className="fr-btn" onClick={() => navigate('/')}>
          Accéder à l&apos;accueil
        </button>
      </div>
    </Page>
  );
};

export default StudentSignInSuccess;
