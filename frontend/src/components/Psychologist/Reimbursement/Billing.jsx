import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';

import { ButtonGroup, Callout, CalloutText } from '@dataesr/react-dsfr';
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
      response.forEach(appointment => {
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
    <>
      <Callout hasInfoIcon={false}>
        <CalloutText className="fr-text">
          À la fin de chaque mois, vous devez envoyer votre facture contenant vos séances réalisées
          à votre université de convention.
          <br />
          Les modalités d&lsquo;envoi sont précisées par l&lsquo;université lors de l&lsquo;établissement de
          votre convention (Chorus pro, email ou voie postale).
          <br />
          L&lsquo;université se chargera du remboursement, dans les 30 jours après la réception de cette facture.
        </CalloutText>
      </Callout>
      <div className="fr-my-2w">
        <h3>Générer ma facture</h3>
        <div className={styles.monthPickerContainer}>
          Générer ma facture pour le mois de :
          <div className={styles.monthPicker}>
            <MonthPicker month={month} setMonth={setMonth} />
          </div>
        </div>

        {filteredDate.length > 0 ? (
          <>
            <p className="fr-my-2w" data-test-id="bill-summary-text">
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
              étudiants.
            </p>
            <a
              className="fr-btn fr-mb-2w"
              href={`/psychologue/bill/${month.month}/${month.year}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="fr-fi-file-download-line" aria-hidden="true" />
              Télécharger/Imprimer ma facture pré-remplie
            </a>
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
        <p className="fr-mb-1w">
          Le nom des étudiants est couvert par le secret médical,
          ne le communiquez pas sur la facture.
          Le nombre d&lsquo;étudiant suffit.
        </p>
        <p className="fr-mb-1w">
          Si le prestataire n’est pas assujetti à la TVA,
          la facture doit comporter la mention «TVA non applicable, art.293 B du CGI »
        </p>
        <p className="fr-mb-1w">
          Un doute sur le modèle de votre facture ?
          Vous pouvez prendre exemple sur ce modèle qui contient tous les éléments requis pour votre remboursement :
        </p>
        <ButtonGroup isInlineFrom="xs" className="fr-my-2w">
          <a
            className="fr-btn fr-btn--secondary"
            href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="fr-fi-file-download-line" aria-hidden="true" />
            .pdf
          </a>
          <a
            className="fr-btn fr-btn--secondary"
            href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.docx`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="fr-fi-file-download-line" aria-hidden="true" />
            Microsoft Word .docx
          </a>
          <a
            className="fr-btn fr-btn--secondary"
            href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.odt`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="fr-fi-file-download-line" aria-hidden="true" />
            Libre Office .odt
          </a>
        </ButtonGroup>
        <h3>Demander de l&lsquo;aide</h3>
        <ButtonGroup isInlineFrom="xs">
          <HashLink
            className="fr-btn fr-btn--secondary"
            to="/faq?section=psychologue#remboursement"
          >
            Consulter la Foire Aux Questions
          </HashLink>
          <a
            className="fr-btn fr-btn--secondary"
            href={`${__API__}/static/documents/tutoriel_choruspro_sante-psy-etudiant.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="fr-fi-file-download-line" aria-hidden="true" />
            Tutoriel Chorus PRO
          </a>
        </ButtonGroup>
      </div>
    </>
  );
};

export default Billing;
