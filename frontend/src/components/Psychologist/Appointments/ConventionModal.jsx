import React, { useState } from 'react';
import { Modal, ModalTitle, ModalContent } from '@dataesr/react-dsfr';
import { checkConvention } from 'services/conventionVerification';
import ConventionForm from '../PsyDashboard/ConventionForm';

const ConventionModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const saveResult = () => {
    setIsOpen(false);
    checkConvention();
  };

  return (
    <Modal
      isOpen={isOpen}
      data-test-id="convention-modal"
      canClose={false}
      hide={() => {}}
    >
      <ModalTitle>Veuillez renseigner votre convention</ModalTitle>
      <ModalContent>
        <div className="fr-mb-2w">
          Pour déclarer vos séances vous devez obligatoirement indiqué le statut de votre convention.
          Si vous n&lsquo;avez pas encore été contacté par une université pour établir votre convention,
          vous pouvez temporairement selectionner
          {' '}
          <em>Aucune pour le moment</em>
          .
          <br />
          Si vous n&lsquo;avez pas de nouvelles de l&lsquo;université sous 2 à 4 semaines,
          {' '}
          <a href="mailto:support-santepsyetudiant@beta.gouv.fr?subject=Demande%20sur%20la%20convention" target="_blank" rel="noopener noreferrer">
            contactez-nous
          </a>
          .
        </div>
        <ConventionForm
          onConventionUpdated={saveResult}
        />
      </ModalContent>
    </Modal>
  );
};

export default ConventionModal;
