import React, { useState, useEffect } from 'react';

import { Header as DSHeader, HeaderBody, Logo, Service } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth } from 'services/date';
import billingInfoService from 'services/billingInfo';
import billingDataService from 'services/billingData';
import { useParams } from 'react-router-dom';
import { useStore } from 'stores/';
import BillingTable from './BillingTable';

import styles from './bill.cssmodule.scss';
import useAppointmentsByDate from './hooks/appointmentsByDate';

const Bill = () => {
  const FULL_UNDERSCORE_LINE = '_____________________________________________________________________________________';
  const PARTIAL_UNDESCORE_LINE_UNI_NAME = '________________________________________________________';

  const { month, year } = useParams();
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);
  const [user, setUser] = useState({});
  const [filteredDates, setFilteredDates] = useState([]);
  const [valuesByDate, setValuesByDate] = useState({ appointments: {}, firstAppointments: {} });
  const [universityInfos, setUniversityInfos] = useState({
    name: undefined,
    address: undefined,
    billingAddress: undefined,
  });

  const { commonStore: { setNotification } } = useStore();
  useAppointmentsByDate(setValuesByDate, month);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await agent.Auth.getConnected();
        setUser(response.data.user);

        const { universityId } = response.data.user.convention;
        if (universityId) {
          const university = await agent.University.getOne(universityId);
          if (university && (university.address || university.postal_code || university.city || university.billingAddress)) {
            setUniversityInfos({
              name: university.name,
              address: [university.address || '', university.postal_code || '', university.city || '']
                .filter(x => x)
                .join(' '),
              billingAddress: university.billingAddress,
            });
          }
        }
      } catch (e) {
        setNotification('Une erreur est survenue', false, false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (filteredDates.length > 0 && Object.keys(valuesByDate).length > 0 && Object.keys(user).length > 0 && universityInfos.name !== undefined) {
      window.print();
    }
  }, [filteredDates, valuesByDate, user, universityInfos]);

  useEffect(() => {
    const filteredDatesResult = billingDataService.getFilteredDates(valuesByDate.appointments, parsedMonth, parsedYear);
    setFilteredDates(filteredDatesResult);
  }, [valuesByDate, parsedMonth, parsedYear]);

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
      { index: 1, text: `Nom, prénom du prestataire : ${user.useLastName || user.lastName} ${user.useFirstNames || user.firstNames}` },
      { index: 2, text: `Numéro SIRET : ${billingInfo.siret || '___________________'}` },
      { index: 3, text: `Numéro ADELI : ${user.adeli}` },
      { index: 4, text: `Adresse du prestataire : ${user.address}` },
      { index: 5, text: `Email du prestataire : ${user.email}` },
      { index: 6, text: `Date de l'émission de la facture : ${formatFrenchDate(new Date())}` },
      {
        index: 7,
        text: `Numéro de la facture : 
      ${billingInfo.billingNumber || '________________________________________________________________'}`,
      },
      { index: 8, text: `Nom et adresse de l'université : ${universityInfos.name || PARTIAL_UNDESCORE_LINE_UNI_NAME}` },
      { index: 9, text: `${universityInfos.address || FULL_UNDERSCORE_LINE}` },
      { index: 10, text: 'Email ou adresse postale du service facturier de l’université (destinataire de la facture) :' },
      { index: 11, text: billingAddress },
      {
        index: 12,
        text: `Numéro du bon de commande de l’université (à demander à l’université) : 
      ${billingInfo.orderNumber || '___________________'}`,
      },
    ];
  };

  const getFooter = () => {
    const billingInfo = billingInfoService.get();
    return [
      { index: 1, text: 'À régler sur le compte bancaire ci-dessous (RIB / IBAN) :' },
      { index: 2, text: billingInfo.iban ? billingInfo.iban : FULL_UNDERSCORE_LINE },
      { index: 3, text: '« TVA non applicable selon l’article 261-4-1 du Code Général des Impôts »' },
      { index: 4, text: 'Délai de paiement : 30 jours à réception de facture' },
    ];
  };

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
          <div key={info.index} className={styles.info}>{info.text}</div>
        ))}
      </div>
      <div className={styles.content}>
        <BillingTable
          filteredDates={filteredDates}
          appointments={valuesByDate.appointments} />
      </div>
      <div className={styles.content}>
        {getFooter().map(info => (
          <div key={info.index} className={styles.info}>{info.text}</div>
        ))}
      </div>
    </>
  );
};

export default Bill;
