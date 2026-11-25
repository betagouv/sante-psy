import React from 'react';
import { Link } from 'react-router-dom';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { checkConvention } from 'services/conventionVerification';
import ConventionForm from '../PsyDashboard/PsySection/ConventionForm';

const modal = createModal({
  id: 'convention-modal',
  isOpenedByDefault: true,
});

const ConventionModal = () => {
  const saveResult = () => {
    modal.close();
    checkConvention();
  };

  return (
    <modal.Component
      title="Veuillez renseigner votre convention"
      concealingBackdrop={false}
      data-test-id="convention-modal"
    >
      <div className="fr-mb-2w">
        Pour déclarer vos séances vous devez obligatoirement indiqué le statut
        de votre convention. Si vous n&lsquo;avez pas encore été contacté par
        une université pour établir votre convention, vous pouvez temporairement
        selectionner <em>Aucune pour le moment</em>
        .
        <br />
        Si vous n&lsquo;avez pas de nouvelles de l&lsquo;université sous 2 à 4
        semaines,{' '}
        <Link
          to={{
            pathname: '/contact/formulaire',
            state: { reason: 'convention' },
          }}
        >
          contactez nous
        </Link>
        .
      </div>
      <ConventionForm onConventionUpdated={saveResult} />
    </modal.Component>
  );
};

export default ConventionModal;
