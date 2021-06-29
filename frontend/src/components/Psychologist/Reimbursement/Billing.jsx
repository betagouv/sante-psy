import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';

import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatMonth } from 'services/date';

import BillingTable from './BillingTable';

import styles from './billing.cssmodule.scss';

const Billing = () => {
  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [valuesByDate, setValuesByDate] = useState({ appointments: {}, patients: {} });

  useEffect(() => {
    agent.Appointment.get().then(response => {
      const appointmentsByDate = {};
      const patientsByDate = {};
      response.appointments.forEach(appointment => {
        const existingAppointments = appointmentsByDate[appointment.appointmentDate];
        appointmentsByDate[appointment.appointmentDate] = existingAppointments ? existingAppointments + 1 : 1;
        const existingPatients = patientsByDate[appointment.appointmentDate];
        if (existingPatients) {
          existingPatients.push(appointment.patientId);
        } else {
          patientsByDate[appointment.appointmentDate] = [appointment.patientId];
        }
      });
      setValuesByDate({
        appointments: appointmentsByDate,
        patients: patientsByDate,
      });
    });
  }, []);

  const filteredDate = Object.keys(valuesByDate.appointments).filter(date => {
    const appointmentDate = new Date(date);
    return appointmentDate.getFullYear() === month.year
        && appointmentDate.getMonth() === month.month - 1;
  });

  return (
    <div className="fr-mb-3w">
      <h2>Facturation</h2>
      <h3>
        Comment mes séances seront-elles remboursées ?
      </h3>
      <div className="fr-mb-2w">
        <p className="fr-mb-2w">
          À la fin de chaque mois, vous devez envoyer votre facture contenant vos séances réalisées à votre
          université de convention. Les modalités d&lsquo;envoi sont précisées par l&lsquo;université lors de
          l&lsquo;établissement de votre convention (Chorus pro, email ou voie postale).
          L&lsquo;université se chargera du remboursement, dans les 30 jours après la réception de cette facture.
        </p>
        <p className="fr-mb-1v">
          Besoin de plus d&lsquo;informations ?
        </p>
        <HashLink
          className="fr-btn fr-btn--secondary fr-mt-2w"
          to="/faq#remboursement"
        >
          Consulter la Foire Aux Questions
        </HashLink>
      </div>
      <h3>
        Aide pour la facturation
      </h3>
      <div className={styles.monthPickerContainer}>
        Générer ma facture pour le mois de :
        <div className={styles.monthPicker}>
          <MonthPicker month={month} setMonth={setMonth} />
        </div>
      </div>

      {filteredDate.length > 0 ? (
        <>
          <a
            className="fr-btn fr-btn--secondary fr-mt-2w fr-mb-2w"
            href={`/psychologue/bill/${month.month}/${month.year}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="fr-fi-file-download-line" aria-hidden="true" />
            Télécharger/Imprimer ma facture pré-remplie
          </a>
          <p className="fr-mb-2w" data-test-id="bill-summary-text">
            En
            {` ${formatMonth(month)}`}
            , vous avez effectué
            <b>
              {` ${filteredDate.reduce((accumulator, date) => accumulator + valuesByDate.appointments[date], 0)} `}
            </b>
            séances auprès de
            <b>
              {` ${filteredDate
                .flatMap(date => valuesByDate.patients[date])
                .filter((value, index, array) => array.indexOf(value) === index)
                .length}
               `}
            </b>
            patients.
          </p>
          <BillingTable filteredDate={filteredDate} appointments={valuesByDate.appointments} />
        </>
      ) : (
        <p className="fr-mb-2w">
          Vous n&lsquo;avez pas encore déclaré de séances pour le mois de
          {` ${formatMonth(month)}`}
          , vous retrouverez ici votre récapitulatif de séances dans le but de créer vous même votre facture
        </p>
      )}

      <h3>Les élements à apparaître sur votre facturation</h3>
      <p className="fr-mb-2w">
        Le nom des patients est couvert par le secret médical,
        ne le communiquez pas sur la facture.
        Le nombre de patients suffit.
      </p>
      <p className="fr-mb-2w">
        Si le prestataire n’est pas assujetti à la TVA,
        la facture doit comporter la mention «TVA non applicable, art.293 B du CGI »
      </p>
      <p className="fr-mb-2w">
        Un doute sur le modèle de votre facture ?
        Vous pouvez prendre exemple sur ce modèle qui contient tous les éléments requis pour votre remboursement :
      </p>
      <p className="fr-mb-2w">
        <a
          className="fr-btn fr-btn--secondary fr-mt-2w fr-mr-1w"
          href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.pdf`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="fr-fi-file-download-line" aria-hidden="true" />
          .pdf
        </a>
        <a
          className="fr-btn fr-btn--secondary fr-mt-2w fr-mr-1w"
          href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.docx`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="fr-fi-file-download-line" aria-hidden="true" />
          Microsoft Word .docx
        </a>
        <a
          className="fr-btn fr-btn--secondary fr-mt-2w fr-mr-1w"
          href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.odt`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="fr-fi-file-download-line" aria-hidden="true" />
          Libre Office .odt
        </a>
      </p>
    </div>
  );
};

export default Billing;
