import React from 'react';
import { TextInput } from '@dataesr/react-dsfr';

const BillingInfo = ({ billingInfo, setBillingInfo, universityHasBillingAddress }) => (
  <>
    <TextInput
      label="Numéro SIRET"
      hint="Il est composé de 14 chiffres."
      value={billingInfo.siret}
      onChange={e => setBillingInfo({ ...billingInfo, siret: e.target.value })}
    />
    {!universityHasBillingAddress && (
      <>
        <TextInput
          label="E-mail ou adresse postale du service facturier de l’université (destinataire de la facture) :"
          value={billingInfo.address1}
          onChange={e => setBillingInfo({ ...billingInfo, address1: e.target.value })}
        />
        <TextInput
          value={billingInfo.address2}
          onChange={e => setBillingInfo({ ...billingInfo, address2: e.target.value })}
        />
      </>
    )}
    <TextInput
      label="Numéro du bon de commande de l’université (à demander à l’université) :"
      value={billingInfo.orderNumber}
      onChange={e => setBillingInfo({ ...billingInfo, orderNumber: e.target.value })}
    />
    <TextInput
      label="À régler sur le compte bancaire ci-dessous (RIB / IBAN) :"
      value={billingInfo.iban}
      onChange={e => setBillingInfo({ ...billingInfo, iban: e.target.value })}
    />
  </>
);

export default BillingInfo;
