import React, { useEffect, useState } from 'react';

import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import billingInfoService from 'services/billingInfo';
import agent from 'services/agent';
import { useStore } from 'stores/';
import BillingInfo from './BillingInfo';
import styles from './billing.cssmodule.scss';

const BillingInfoPage = () => {
  const {
    userStore: { user },
  } = useStore();
  const [billingInfo, setBillingInfo] = useState(billingInfoService.get());
  const [universityHasBillingAddress, setUniversityHasBillingAddress] =
    useState(false);

  useEffect(() => {
    if (user.convention && user.convention.universityId) {
      agent.University.getOne(user.convention.universityId).then(
        (university) => {
          if (university.billingAddress) {
            setUniversityHasBillingAddress(true);
          }
        },
      );
    }
  }, [user]);

  const handleSave = () => {
    billingInfoService.save(billingInfo);
    window.close();
  };

  const handleCancel = () => {
    setBillingInfo(billingInfoService.get());
    window.close();
  };

  return (
    <>
      <div className={`fr-my-2w ${styles.separator}`} />
      <BillingInfo
        billingInfo={billingInfo}
        setBillingInfo={setBillingInfo}
        universityHasBillingAddress={universityHasBillingAddress}
        hideInvoiceNumber
      />

      <ButtonsGroup
        className="fr-mt-4w"
        inlineLayoutWhen="always"
        buttons={[
          {
            children: 'Annuler',
            priority: 'secondary',
            iconId: 'fr-icon-close-line',
            iconPosition: 'left',
            onClick: handleCancel,
          },
          {
            children: 'Enregistrer',
            iconId: 'fr-icon-save-line',
            iconPosition: 'left',
            onClick: handleSave,
          },
        ]}
      />
    </>
  );
};

export default BillingInfoPage;
