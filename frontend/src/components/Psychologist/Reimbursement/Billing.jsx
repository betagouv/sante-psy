import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Button, ButtonGroup, Callout, CalloutText } from '@dataesr/react-dsfr';
import MonthPicker from 'components/Date/MonthPicker';

import agent from 'services/agent';
import { formatMonth } from 'services/date';
import billingInfoService from 'services/billingInfo';

import BillingTable from './BillingTable';
import BillingInfo from './BillingInfo';
import BillingHelper from './BillingHelper';

import styles from './billing.cssmodule.scss';

const Billing = () => {
  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [valuesByDate, setValuesByDate] = useState({ appointments: {}, patients: {} });
  const [fillInfo, setFillInfo] = useState(false);
  const [billingInfo, setBillingInfo] = useState(billingInfoService.get());

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
            <div className="fr-mb-2w">
              {fillInfo ? (
                <BillingInfo
                  billingInfo={billingInfo}
                  setBillingInfo={setBillingInfo}
                />
              ) : (
                <Button
                  secondary
                  icon="fr-fi-edit-line"
                  onClick={() => setFillInfo(true)}
                >
                  Remplir votre facture en ligne
                </Button>
              )}
            </div>
            <ButtonGroup className="fr-mb-2w" isInlineFrom="xs">
              <a
                className="fr-btn"
                href={`/psychologue/bill/${month.month}/${month.year}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => billingInfoService.save(billingInfo)}
              >
                <span className={classNames(styles.downloadIcon, 'fr-fi-file-download-line')} aria-hidden="true" />
                Télécharger/Imprimer
              </a>
              {fillInfo && (
              <Button
                secondary
                icon="fr-fi-close-line"
                onClick={() => {
                  setBillingInfo(billingInfoService.get());
                  setFillInfo(false);
                }}
              >
                Annuler
              </Button>
              )}
            </ButtonGroup>
            <BillingTable
              filteredDate={filteredDate}
              appointments={valuesByDate.appointments}
            />
          </>
        ) : (
          <p className="fr-mb-2w">
            Vous n&lsquo;avez pas encore déclaré de séances pour le mois de
            {` ${formatMonth(month)}`}
            , vous retrouverez ici votre récapitulatif de séances dans le but de créer vous même votre facture
          </p>
        )}
        <BillingHelper />
      </div>
    </>
  );
};

export default Billing;
