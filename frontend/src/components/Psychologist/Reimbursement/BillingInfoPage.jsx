import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@dataesr/react-dsfr';

import billingInfoService from 'services/billingInfo';
import agent from 'services/agent';
import { useStore } from 'stores/';
import BillingInfo from './BillingInfo';
import styles from './billing.cssmodule.scss';

const BillingInfoPage = () => {
  const { userStore: { user } } = useStore();
  const [billingInfo, setBillingInfo] = useState(billingInfoService.get());
  const [universityHasBillingAddress, setUniversityHasBillingAddress] = useState(false);

  useEffect(() => {
    if (user.convention && user.convention.universityId) {
      agent.University.getOne(user.convention.universityId).then(university => {
        if (university.billingAddress) {
          setUniversityHasBillingAddress(true);
        }
      });
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

      <ButtonGroup className="fr-mt-4w" isInlineFrom="xs">
        <Button
          secondary
          icon="ri-close-line"
          onClick={handleCancel}
                >
          Annuler
        </Button>
        <Button
          icon="ri-save-line"
          onClick={handleSave}
                >
          Enregistrer
        </Button>
      </ButtonGroup>
    </>
  );
};

export default BillingInfoPage;
