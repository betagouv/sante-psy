import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Modal, ModalTitle, ModalContent } from '@dataesr/react-dsfr';
import { useStore } from 'stores/';
import { checkConvention } from 'services/conventionVerification';
import ConventionForm from '../Profile/ConventionForm';

const ConventionModal = ({ currentConvention }) => {
  const { commonStore: { config } } = useStore();
  const [isOpen, setIsOpen] = useState(true);

  const saveResult = () => {
    document.body.style.overflow = null;
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
        Pour déclarer vos séances vous devez obligatoirement indiqué le statut de votre convention.
        Si vous n&lsquo;avez pas encore été contacté par une université pour établir votre convention,
        vous pouvez temporairement selectionner
        {' '}
        <em>Aucune pour le moment</em>
        .
        Si vous n&lsquo;avez pas de nouvelles de l&lsquo;université sous 2 à 4 semaines, envoyez nous un mail à
        {' '}
        <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
        .
        <ConventionForm
          currentConvention={currentConvention}
          onConventionUpdated={saveResult}
        />
      </ModalContent>
    </Modal>
  );
};

export default observer(ConventionModal);
