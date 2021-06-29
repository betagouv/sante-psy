import React, { useState, useEffect } from 'react';

import Logo from 'components/Logo/LogoHeader';

import agent from 'services/agent';
import { formatFrenchDate, formatMonth } from 'services/date';

import { useParams } from 'react-router-dom';
import BillingTable from './BillingTable';

import styles from './bill.cssmodule.scss';

const Bill = () => {
  const { month, year } = useParams();
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    agent.Appointment.get().then(response => {
      const appointmentsByDate = {};
      response.appointments.forEach(appointment => {
        const existingValue = appointmentsByDate[appointment.appointmentDate];
        appointmentsByDate[appointment.appointmentDate] = existingValue ? existingValue + 1 : 1;
      });
      setAppointments(appointmentsByDate);
    });
    agent.User.getConnected().then(response => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    if (Object.keys(appointments).length > 0 && Object.keys(user).length > 0) {
      window.print();
    }
  }, [appointments, user]);

  const filteredDate = Object.keys(appointments).filter(date => {
    const appointmentDate = new Date(date);
    return appointmentDate.getFullYear() === parseInt(year, 10)
        && appointmentDate.getMonth() === parseInt(month, 10) - 1;
  });

  const getInfos = () => [
    `Nom, prénom du prestataire : ${user.lastName} ${user.firstNames}`,
    `Numéro d’enregistrement professionnel (SIRET ou numéro ADELI) : ${user.adeli}`,
    `Adresse du prestataire : ${user.address}`,
    `Email du prestataire : ${user.email}`,
    `Date de l'émission de la facture : ${formatFrenchDate(new Date())}`,
    'Numéro de la facture : ________________________________________________________________',
    'Nom et adresse de l\'université : ________________________________________________________',
    '_____________________________________________________________________________________',
    'E-mail ou adresse postale du service facturier de l’université (destinataire de la facture) :',
    '_____________________________________________________________________________________',
    '_____________________________________________________________________________________',
    'Numéro du bon de commande de l’université (à demander à l’université) : ___________________',
  ];

  const getFooter = () => [
    'À régler sur le compte bancaire ci-dessous (RIB / IBAN) :',
    '_____________________________________________________________________________________',
    'Délai de paiement : 30 jours à réception de facture',
  ];

  return (
    <>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className={styles.header}>
              <div className="fr-header__brand-top">
                <Logo />
              </div>
              <div className="fr-header__service">
                <p className="fr-header__service-title">
                  {__APPNAME__}
                </p>
                <p className="fr-header__service-tagline">{`Facture ${formatMonth({ month, year })}`}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.content}>
        {getInfos().map(info => (
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
