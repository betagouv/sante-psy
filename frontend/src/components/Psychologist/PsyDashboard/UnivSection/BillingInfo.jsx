import React from 'react';
import billingInfoService from 'services/billingInfo';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { useNavigate } from 'react-router-dom';
import styles from './univSection.cssmodule.scss';

const BillingInfoDashboard = () => {
  const billingInfo = billingInfoService.get();
  const navigate = useNavigate();
  const checkIsEmpty = (value) => (value?.trim() ? value : '-');

  return (
    <section className={styles.univBillingCard}>
      {billingInfo ? (
        <div>
          <h2>Données de facturation</h2>
          <Button
            priority="secondary"
            className={styles.buttonEdit}
            iconId="ri-external-link-line"
            iconPosition="right"
            onClick={() => {
              navigate('/psychologue/mes-remboursements/');
            }}
          >
            Facturation
          </Button>
          <p>
            <b>SIRET :</b>
            &nbsp;
            {checkIsEmpty(billingInfo.siret)}
          </p>
          <p>
            <b>IBAN :</b>
            &nbsp;
            {checkIsEmpty(billingInfo.iban)}
          </p>
          <p>
            <b>Bon de commande :</b>
            &nbsp; {checkIsEmpty(billingInfo.orderNumber)}
          </p>
          <Button
            priority="secondary"
            className={styles.buttonEdit}
            iconId="ri-edit-line"
            onClick={() => {
              navigate('/psychologue/mes-remboursements/?openBillingInfo=true');
            }}
          >
            Modifier
          </Button>
        </div>
      ) : (
        <div>
          <p>Vous n&apos;avez aucune donnée de facturation remplie</p>
        </div>
      )}
    </section>
  );
};

export default BillingInfoDashboard;
