import React, { useState, useEffect } from 'react';

import { Header as DSHeader, HeaderBody, Logo, Service } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth } from 'services/date';
import billingInfoService from 'services/billingInfo';
import billingDataService from 'services/billingData';
import { useParams } from 'react-router-dom';
import BillingTable from './BillingTable';

import styles from './bill.cssmodule.scss';
import useAppointmentsByDate from './commonEffect';

const Bill = () => {
  const FULL_UNDERSCORE_LINE = '_____________________________________________________________________________________';
  const PARTIAL_UNDESCORE_LINE_UNI_NAME = '________________________________________________________';

  const { month, year } = useParams();
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);
  const [user, setUser] = useState({});

  const [valuesByDate, setValuesByDate] = useState({ appointments: {}, firstAppointments: {} });
  const [universityInfos, setUniversityInfos] = useState({
    name: undefined,
    address: undefined,
    billingAddress: undefined,
  });

  useAppointmentsByDate(setValuesByDate);

  useEffect(() => {
    agent.User.getConnected().then(response => {
      setUser(response.data);

      const { universityId } = response.data.convention;
      if (universityId) {
        agent.University.getOne(universityId).then(university => {
          if (university && (university.address || university.postal_code || university.city)) {
            setUniversityInfos({
              name: university.name,
              address: [university.address || '', university.postal_code || '', university.city || '']
                .filter(x => x)
                .join(' '),
              billingAddress: university.billingAddress,
            });
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(valuesByDate).length > 0 && Object.keys(user).length > 0 && universityInfos.name !== undefined) {
      window.print();
    }
  }, [valuesByDate, user, universityInfos]);

  const getInfos = () => {
    const billingInfo = billingInfoService.get();
    let billingAddress;

    if (universityInfos.billingAddress) {
      billingAddress = universityInfos.billingAddress;
    } else if (billingInfo.address1) {
      billingAddress = `${billingInfo.address1}\n${billingInfo.address2 ? billingInfo.address2 : FULL_UNDERSCORE_LINE}`;
    } else {
      billingAddress = FULL_UNDERSCORE_LINE;
    }

    return [
      `Nom, prénom du prestataire : ${user.lastName} ${user.firstNames}`,
      `Numéro SIRET : ${billingInfo.siret || '___________________'}`,
      `Numéro ADELI : ${user.adeli}`,
      `Adresse du prestataire : ${user.address}`,
      `Email du prestataire : ${user.email}`,
      `Date de l'émission de la facture : ${formatFrenchDate(new Date())}`,
      `Numéro de la facture : 
      ${billingInfo.billingNumber || '________________________________________________________________'}`,
      `Nom et adresse de l'université : ${universityInfos.name || PARTIAL_UNDESCORE_LINE_UNI_NAME}`,
      `${universityInfos.address || FULL_UNDERSCORE_LINE}`,
      'E-mail ou adresse postale du service facturier de l’université (destinataire de la facture) :',
      billingAddress,
      `Numéro du bon de commande de l’université (à demander à l’université) : 
      ${billingInfo.orderNumber || '___________________'}`,
    ];
  };

  const getFooter = () => {
    const billingInfo = billingInfoService.get();
    return [
      'À régler sur le compte bancaire ci-dessous (RIB / IBAN) :',
      billingInfo.iban ? billingInfo.iban : FULL_UNDERSCORE_LINE,
      'Délai de paiement : 30 jours à réception de facture',
    ];
  };

  const filteredDates = billingDataService.getFilteredDates(valuesByDate.appointments, parsedMonth, parsedYear);
  const filteredFirstDates = billingDataService.getFilteredDates(valuesByDate.firstAppointments, parsedMonth, parsedYear);

  return (
    <>
      {/* TODO: fix print view (by using styles.header?) */}
      <DSHeader>
        <HeaderBody>
          <Logo>Ministère de l&lsquo;Enseignement Supérieur et de la Recherche</Logo>
          <Service title="Santé Psy Étudiant" description={`Facture ${formatMonth({ month, year })}`} />
        </HeaderBody>
      </DSHeader>
      <div className={styles.content}>
        {getInfos().map(info => (
          <div className={styles.info}>{info}</div>
        ))}
      </div>
      <div className={styles.content}>
        <BillingTable
          filteredFirstDates={filteredFirstDates}
          firstAppointments={valuesByDate.firstAppointments}
          filteredDates={filteredDates}
          appointments={valuesByDate.appointments} />
      </div>
      <div className={styles.content}>
        {getFooter().map(info => (
          <div className={styles.info}>{info}</div>
        ))}
      </div>
    </>
  );
};

export default Bill;
