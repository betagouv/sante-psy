import React from 'react';
import { Input } from '@codegouvfr/react-dsfr/Input';

const BillingInfo = ({
  billingInfo,
  setBillingInfo,
  universityHasBillingAddress,
}) => (
  <>
    <Input
      label="Numéro SIRET"
      hintText="Il est composé de 14 chiffres."
      nativeInputProps={{
        value: billingInfo.siret,
        onChange: (e) =>
          setBillingInfo({ ...billingInfo, siret: e.target.value }),
      }}
    />

    {!universityHasBillingAddress && (
      <>
        <Input
          label="Email ou adresse postale du service facturier de l’université (destinataire de la facture) :"
          nativeInputProps={{
            value: billingInfo.address1,
            onChange: (e) =>
              setBillingInfo({ ...billingInfo, address1: e.target.value }),
          }}
        />

        <Input
          nativeInputProps={{
            value: billingInfo.address2,
            onChange: (e) =>
              setBillingInfo({ ...billingInfo, address2: e.target.value }),
          }}
        />
      </>
    )}

    <Input
      label="Numéro du bon de commande de l’université (à demander à l’université) :"
      nativeInputProps={{
        value: billingInfo.orderNumber,
        onChange: (e) =>
          setBillingInfo({ ...billingInfo, orderNumber: e.target.value }),
      }}
    />

    <Input
      label="À régler sur le compte bancaire ci-dessous (RIB / IBAN) :"
      nativeInputProps={{
        value: billingInfo.iban,
        onChange: (e) =>
          setBillingInfo({ ...billingInfo, iban: e.target.value }),
      }}
    />
  </>
);

export default BillingInfo;
