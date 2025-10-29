import React from 'react';
import Page from 'components/Page/Page';
import '@gouvfr/dsfr/dist/utility/utility.min.css';
import '@gouvfr/dsfr/dist/component/alert/alert.min.css';

const StudentRegisterValidation = () => {
  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title="Dernière étape !"
    >
      <div className="fr-container fr-my-4w">
          <h3 className="">Inscription enregistrée</h3>
          <p>
            Vous allez recevoir un email de connexion.<br />
            Cliquez sur le lien dans le mail pour continuer.
          </p>
      </div>
    </Page>
  );
};

export default StudentRegisterValidation;
