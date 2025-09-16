import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';

import Announcement from 'components/Notification/Announcement';
import Appointments from 'components/Psychologist/Appointments/Appointments';
import NewAppointment from 'components/Psychologist/Appointments/NewAppointment';
import Patients from 'components/Psychologist/Patients/Patients';
import AddEditPatient from 'components/Psychologist/Patients/AddEditPatient';
import PsyProfile from 'components/Psychologist/PsyDashboard/PsyDashboard';
import Page from 'components/Page/Page';
import Notification from 'components/Notification/Notification';
import ConventionModal from 'components/Psychologist/Appointments/ConventionModal';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Billing from 'components/Psychologist/Reimbursement/Billing';
import BillingInfoPage from 'components/Psychologist/Reimbursement/BillingInfoPage';
import ConventionForm from 'components/Psychologist/PsyDashboard/PsySection/ConventionForm';
import SuspendProfile from 'components/Psychologist/PsyDashboard/PsySection/SuspendProfile';
import EditProfile from 'components/Psychologist/PsyDashboard/PsySection/EditProfile';
import SendPatientCertificate from 'components/Psychologist/Patients/SendPatientCertificate';

import { shouldCheckConventionAgain } from 'services/conventionVerification';
import { useStore } from './stores';
import { getInactiveMessage } from './utils/inactive';

import './custom-month-picker.css';
import './custom-date-picker.css';

const PsychologistRouter = () => {
  const { userStore: { user } } = useStore();
  const { pathname } = useLocation();

  const hasSignedConvention = user.convention && user.convention.isConventionSigned;
  const modal = hasSignedConvention || !shouldCheckConventionAgain()
    ? null
    : <ConventionModal currentConvention={user.convention} />;

  const getPageProps = () => {
    const page = pathname.split('/')[2];
    switch (page) {
      case 'modifier-profil':
        return {
          breadCrumbs: [{ href: '/psychologue/tableau-de-bord', label: 'Tableau de bord' }],
          currentBreadCrumb: 'Modifier mon profil',
          title: (
            <>
              Mes informations
              {' '}
              <b>Annuaire</b>
            </>
          ),
        };
      case 'ma-convention':
        return {
          breadCrumbs: [{ href: '/psychologue/tableau-de-bord', label: 'Tableau de bord' }],
          currentBreadCrumb: 'Ma convention',
          title: (
            <>
              Ma
              {' '}
              <b>convention</b>
            </>
          ),
        };
      case 'ma-disponibilite':
        return {
          breadCrumbs: [{ href: '/psychologue/tableau-de-bord', label: 'Tableau de bord' }],
          currentBreadCrumb: 'Ma disponibilité',
          title: (
            <>
              Mon statut
              {' '}
              <b>Annuaire</b>
            </>
          ),
        };
      case 'nouvelle-seance':
        return {
          title: (
            <>
              Nouvelle
              {' '}
              <b>séance</b>
            </>
          ),
          tutorial: 'new-appointment',
        };
      case 'mes-etudiants':
        return {
          title: (
            <>
              Gérer mes
              {' '}
              <b>étudiants</b>
            </>
          ),
          tutorial: 'students',
        };
      case 'nouvel-etudiant':
        return {
          title: (
            <>
              Nouvel
              {' '}
              <b>étudiant</b>
            </>
          ),
          tutorial: 'new-student',
        };
      case 'modifier-etudiant':
        return {
          title: (
            <>
              Modifier le
              {' '}
              <b>dossier</b>
            </>
          ),
          tutorial: 'new-student',
        };
      case 'envoi-certificat':
        return {
          breadCrumbs: [{ href: '/psychologue/mes-etudiants', label: 'Suivi étudiants' }],
          currentBreadCrumb: 'Ajout certificat scolarité',
          title: (
            <>
              Ajout
              {' '}
              <b>certificat scolarité</b>
            </>
          ),
        };
      case 'mes-remboursements':
        return {
          title: (
            <>
              Gérer mes
              {' '}
              <b>facturations</b>
            </>
          ),
          tutorial: 'billing',
        };
      case 'informations-facturation':
        return {
          title: (
            <>
              Modifier
              {' '}
              <b>mes données de facturation</b>
            </>
          ),
          tutorial: 'billing-info',
        };
      case 'tableau-de-bord':
        return {
          title: (
            <>
              Tableau de
              {' '}
              <b>bord</b>
            </>
          ),
          withoutHeader: true,
          tutorial: 'dashboard',
        };
      case 'mes-seances':
        return {
          title: (
            <>
              Déclarer mes
              {' '}
              <b>séances</b>
            </>
          ),
          tutorial: 'appointments',
        };
      default:
        return { withoutHeader: true };
    }
  };

  return (
    <Page
      {...getPageProps()}
      psyPage
      withContact
    >
      <Announcement />
      {modal}
      {user.convention && user.convention.isConventionSigned === null && (
        <Notification type="info">
          Veuillez indiquer l&lsquo;état de votre conventionnement sur la page
          {' '}
          <HashLink to="/psychologue/ma-convention">Ma convention</HashLink>
        </Notification>
      )}
      {user && !user.active && (
        <Notification type="warning">
          Votre profil n&lsquo;est plus visible dans l&lsquo;annuaire.
          {' '}
          {getInactiveMessage(user)}
          {' '}
          <HashLink to="/psychologue/ma-disponibilite">Ma disponibilité</HashLink>
          .
        </Notification>
      )}
      <GlobalNotification className="fr-my-2w" />
      <Routes>
        <Route exact path="/tableau-de-bord" element={<PsyProfile />} />
        <Route exact path="/modifier-profil" element={<EditProfile />} />
        <Route exact path="/mes-seances" element={<Appointments />} />
        <Route exact path="/nouvelle-seance" element={<NewAppointment />} />
        <Route exact path="/nouvelle-seance/:patientId" element={<NewAppointment />} />
        <Route exact path="/mes-etudiants" element={<Patients />} />
        <Route exact path="/nouvel-etudiant" element={<AddEditPatient />} />
        <Route exact path="/modifier-etudiant/:patientId" element={<AddEditPatient />} />
        <Route exact path="/envoi-certificat" element={<SendPatientCertificate />} />
        <Route exact path="/mes-remboursements" element={<Billing />} />
        <Route exact path="/informations-facturation" element={<BillingInfoPage />} />
        <Route exact path="/ma-convention" element={<ConventionForm checkDefaultValue />} />
        <Route exact path="/ma-disponibilite" element={<SuspendProfile />} />
        <Route path="/*" element={<Navigate to="/psychologue/tableau-de-bord" />} />
      </Routes>
    </Page>
  );
};

export default observer(PsychologistRouter);
