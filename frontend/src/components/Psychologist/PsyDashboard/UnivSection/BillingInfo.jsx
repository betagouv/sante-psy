import React from 'react';
import billingInfoService from 'services/billingInfo';
import { Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import styles from './univSection.cssmodule.scss';

const BillingInfoDashboard = () => {
  const billingInfo = billingInfoService.get();
  const navigate = useNavigate();
  const checkIsEmpty = value => (value?.trim() ? value : '-');

  return (
    <section className={styles.univBillingCard}>
      {billingInfo ? (
        <div>
          <h2>Données de facturation</h2>
          <Button
            secondary
            className={styles.buttonEdit}
            title="Facturation"
            icon="ri-external-link-line"
            iconPosition="right"
            onClick={() => {
              navigate('/psychologue/mes-remboursements/');
            }}
            hasBorder="false"
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
&nbsp;
            {' '}
            {checkIsEmpty(billingInfo.orderNumber)}
          </p>
          <Button
            secondary
            className={styles.buttonEdit}
            title="Modify"
            icon="ri-edit-line"
            onClick={() => {
              navigate('/psychologue/mes-remboursements/?openBillingInfo=true');
            }}
            hasBorder="false"
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
