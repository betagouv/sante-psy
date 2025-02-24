import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { HashLink } from 'react-router-hash-link';

import { Button, ButtonGroup, Callout, CalloutText } from '@dataesr/react-dsfr';
import MonthPicker from 'components/Date/MonthPicker';
import Notification from 'components/Notification/Notification';

import agent from 'services/agent';
import { formatMonth } from 'services/date';
import billingInfoService from 'services/billingInfo';
import billingDataService from 'services/billingData';
import { useStore } from 'stores/';
import getBadgeInfos from 'src/utils/badges';
import BillingTable from './BillingTable';
import BillingInfo from './BillingInfo';
import BillingHelper from './BillingHelper';
import useAppointmentsByDate from './hooks/appointmentsByDate';

import styles from './billing.cssmodule.scss';

const Billing = () => {
  const [month, setMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { userStore: { user } } = useStore();

  const [valuesByDate, setValuesByDate] = useState({ appointments: {}, firstAppointments: {}, patients: {} });
  const [fillInfo, setFillInfo] = useState(false);
  const [billingInfo, setBillingInfo] = useState(billingInfoService.get());
  const [universityHasBillingAddress, setUniversityHasBillingAddress] = useState(false);

  useAppointmentsByDate(setValuesByDate, month, true);

  useEffect(() => {
    localStorage.setItem('selectedMonth', JSON.stringify(month));
  }, [month]);

  useEffect(() => {
    if (user.convention && user.convention.universityId) {
      agent.University.getOne(user.convention.universityId).then(university => {
        if (university.billingAddress) {
          setUniversityHasBillingAddress(true);
        }
      });
    }
  });

  const badges = getBadgeInfos();
  const filteredDates = billingDataService.getFilteredDates(valuesByDate.appointments, month.month, month.year);
  const canGenerateBill = user.convention && user.convention.isConventionSigned;
  return (
    <>
      <Callout hasInfoIcon={false}>
        <CalloutText size="md">
          À la fin de chaque mois, vous devez envoyer votre facture contenant vos séances réalisées à votre université
          de convention.
          <br />
          Les modalités d&lsquo;envoi sont précisées par l&lsquo;université lors de l&lsquo;établissement de votre
          convention (Chorus pro, email ou voie postale).
          <br />
          L&lsquo;université se chargera du remboursement, dans les 30 jours après la réception de cette facture.
        </CalloutText>
      </Callout>
      <div className="fr-my-2w">
        <h3>Générer ma facture</h3>
        {!canGenerateBill && (
          <div id="no-convention-alert">
            <Notification type="info">
              Veuillez attendre la signature de votre convention avant d&lsquo;envoyer votre facture. Renseignez le
              statut de votre convention dans la page
              {' '}
              <HashLink to="/psychologue/tableau-de-bord">Tableau de bord</HashLink>
            </Notification>
          </div>
        )}
        <div className={styles.monthPickerContainer}>
          Générer ma facture pour le mois de :
          <div className={styles.monthPicker} id="billing-month">
            <MonthPicker month={month} setMonth={setMonth} />
          </div>
        </div>
        {filteredDates.length > 0 ? (
          <>
            <div className="fr-mb-2w">
              {fillInfo && (
                <BillingInfo
                  billingInfo={billingInfo}
                  setBillingInfo={setBillingInfo}
                  universityHasBillingAddress={universityHasBillingAddress}
                />
              )}
            </div>
            <ButtonGroup className="fr-mb-2w" isInlineFrom="xs">
              {fillInfo ? (
                <Button
                  secondary
                  icon="ri-close-line"
                  onClick={() => {
                    setBillingInfo(billingInfoService.get());
                    setFillInfo(false);
                  }}
                >
                  Annuler
                </Button>
              ) : (
                <Button id="billing-info" secondary icon="ri-edit-line" onClick={() => setFillInfo(true)}>
                  Renseigner mes informations
                </Button>
              )}
              {canGenerateBill ? (
                <a
                  id="billing-generation"
                  className="fr-btn"
                  href={`/psychologue/bill/${month.month}/${month.year}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setFillInfo(false);
                    billingInfoService.save(billingInfo);
                  }}
                >
                  <span className={classNames(styles.downloadIcon, 'ri-file-download-line')} aria-hidden="true" />
                  Télécharger/Imprimer
                </a>
              ) : (
                <Button disabled icon="ri-file-download-line">
                  Télécharger/Imprimer
                </Button>
              )}
            </ButtonGroup>
            <BillingTable
              filteredDates={filteredDates}
              appointments={valuesByDate.appointments}
            />
            <p className="fr-my-2w" data-test-id="bill-summary-text">
              En
              {` ${formatMonth(month)}`}
              , vous avez effectué
              <b>
                {` ${billingDataService.getTotal(filteredDates, valuesByDate.appointments)} `}
              </b>
              séances, dont
              <b>
                {` ${billingDataService.getBadgeTotal(filteredDates, valuesByDate.appointments, badges.first.key)} `}
              </b>
              premières séances, auprès de
              <b>
                {` ${filteredDates
                  .flatMap(date => valuesByDate.patients[date])
                  .filter((value, index, array) => array.indexOf(value) === index)
                  .length}
             `}
              </b>
              étudiants.
            </p>
            <p>
              Entre le premier janvier 2024 et le 1er juillet 2024, la première séance par cycle avec un étudiant est facturée 40€, les suivantes 30€.
              <br />
              A partir du 1er juillet 2024, toutes les séances sont comptabilisées à 50€, le nombre maximal de séances passe de 12 séances par étudiant par année universitaire (1er septembre au 31 août).
            </p>
          </>
        ) : (
          <p className="fr-mb-2w" id="no-appointments">
            Vous n&lsquo;avez pas encore déclaré de séances pour le mois de
            {` ${formatMonth(month)}`}
            , vous retrouverez ici votre récapitulatif de séances dans le but de créer vous
            même votre facture
          </p>
        )}
        <BillingHelper />
      </div>
    </>
  );
};

export default Billing;
