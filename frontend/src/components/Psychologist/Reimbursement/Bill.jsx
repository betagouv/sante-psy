import React, { useState, useEffect } from 'react';

import {
  Header as DSHeader,
  HeaderBody,
  Logo,
  Service,
} from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth, utcDate } from 'services/date';
import billingInfoService from 'services/billingInfo';

import { useParams } from 'react-router-dom';
import BillingTable from './BillingTable';

import styles from './bill.cssmodule.scss';

const Bill = () => {
  const FULL_UNDERSCORE_LINE = '_____________________________________________________________________________________';
  const PARTIAL_UNDESCORE_LINE_UNI_NAME = '________________________________________________________';

  const { month, year } = useParams();
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [billInfos, setBillInfos] = useState([]);
  const [universityInfos, setUniversityInfos] = useState({ name: undefined, address: undefined });

  useEffect(() => {
    agent.Appointment.get().then(response => {
      const appointmentsByDate = {};
      response.forEach(appointment => {
        const existingValue = appointmentsByDate[appointment.appointmentDate];
        appointmentsByDate[appointment.appointmentDate] = existingValue ? existingValue + 1 : 1;
      });
      setAppointments(appointmentsByDate);
    });
    agent.User.getConnected().then(response => {
      setUser(response.data);

      const { universityId } = response.data.convention;
      if (universityId) {
        agent.University.getOne(universityId).then(university => {
          if (university && (university.address || university.postal_code || university.city)) {
            setUniversityInfos({
              name: university.name,
              address: [university.address || '', university.postal_code || '', university.city || '']
                .filter(x => x).join(' '),
            });
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(appointments).length > 0 && Object.keys(user).length > 0) {
      window.print();
    }
    setBillInfos(getInfos());
  }, [appointments, user, billInfos]);

  const filteredDate = Object.keys(appointments).filter(date => {
    const appointmentDate = utcDate(date);
    return appointmentDate.getFullYear() === parseInt(year, 10)
      && appointmentDate.getMonth() === parseInt(month, 10) - 1;
  });

  const getInfos = () => {
    const billingInfo = billingInfoService.get();
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
      billingInfo.address1 || FULL_UNDERSCORE_LINE,
      billingInfo.address1 ? billingInfo.address2 : FULL_UNDERSCORE_LINE,
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

  return (
    <>
      {/* TODO: fix print view (by using styles.header?) */}
      <DSHeader>
        <HeaderBody>
          <Logo>
            Ministère de l&lsquo;Enseignement Supérieur et de la Recherche
          </Logo>
          <Service
            title="Santé Psy Étudiant"
            description={`Facture ${formatMonth({ month, year })}`}
          />
        </HeaderBody>
      </DSHeader>
      <div className={styles.content}>
        {billInfos.map(info => (
          <div className={styles.info}>
            {info}
          </div>
        ))}
      </div>
      <div className={styles.content}>
        <BillingTable filteredDate={filteredDate} appointments={appointments} />
      </div>
      <div className={styles.content}>
        {getFooter().map(info => (
          <div className={styles.info}>
            {info}
          </div>
        ))}
      </div>
    </>
  );
};

export default Bill;
