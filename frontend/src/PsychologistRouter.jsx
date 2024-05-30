import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';

import Announcement from 'components/Notification/Announcement';
import Appointments from 'components/Psychologist/Appointments/Appointments';
import NewAppointment from 'components/Psychologist/Appointments/NewAppointment';
import Patients from 'components/Psychologist/Patients/Patients';
import AddEditPatient from 'components/Psychologist/Patients/AddEditPatient';
import PsyProfile from 'components/Psychologist/PsyDashboard/PsyProfile';
import Page from 'components/Page/Page';
import Notification from 'components/Notification/Notification';
import ConventionModal from 'components/Psychologist/Appointments/ConventionModal';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Billing from 'components/Psychologist/Reimbursement/Billing';
import ConventionForm from 'components/Psychologist/PsyDashboard/ConventionForm';
import SuspendProfile from 'components/Psychologist/PsyDashboard/SuspendProfile';

import { shouldCheckConventionAgain } from 'services/conventionVerification';
import { useStore } from './stores';
import { getInactiveMessage } from './utils/inactive';

import 'react-month-picker/css/month-picker.css';
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
      case 'nouvelle-seance':
        return {
          title: (
            <>
              Nouvelle
              {' '}
              <b>séance</b>
            </>
          ),
          description: 'Vous avez réalisé une séance avec un étudiant ou une étudiante. Renseignez-la sur cette page.',
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
          description: 'Veuillez enregistrer vos nouveaux étudiants afin de déclarer leurs séances pour procéder à vos remboursements.',
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
          description: 'Déclarez un étudiant comme étant patient du dispositif Santé Psy Étudiant. Vous pourrez ensuite déclarer les séances réalisées avec cet étudiant.',
          tutorial: 'new-student',
        };
      case 'modifier-etudiant':
        return {
          title: (
            <>
              Compléter
              {' '}
              <b>les informations</b>
              {' '}
              de l&lsquo;étudiant
            </>
          ),
          tutorial: 'new-student',
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
          description: 'Vous pouvez éditer et générer vos factures sur cet espace avant de les envoyer au Service de Santé Étudiante afin de vous faire rembourser.',
          tutorial: 'billing',
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
          description: 'En tant que psychologue de Santé Psy Étudiant, vous avez la possibilité de gérer les informations au sein de notre annuaire.',
          tutorial: 'profile',
        };
      default:
        return {
          title: (
            <>
              Déclarer mes
              {' '}
              <b>séances</b>
            </>
          ),
          description: 'La déclaration des séances en ligne est nécessaire à votre remboursement.',
          tutorial: 'appointments',
        };
    }
  };

  return (
    <Page
      {...getPageProps()}
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
        {/* est-ce bien le bon nom ? */}
        <HashLink to="/psychologue/ma-disponibilite">Ma disponibilité</HashLink>
        .
      </Notification>
      )}
      <GlobalNotification className="fr-my-2w" />
      <Routes>
        <Route exact path="/tableau-de-bord" element={<PsyProfile />} />
        <Route exact path="/mes-seances" element={<Appointments />} />
        <Route exact path="/nouvelle-seance" element={<NewAppointment />} />
        <Route exact path="/nouvelle-seance/:patientId" element={<NewAppointment />} />
        <Route exact path="/mes-etudiants" element={<Patients />} />
        <Route exact path="/nouvel-etudiant" element={<AddEditPatient />} />
        <Route exact path="/modifier-etudiant/:patientId" element={<AddEditPatient />} />
        <Route exact path="/mes-remboursements" element={<Billing />} />
        <Route exact path="/ma-convention" element={<ConventionForm />} />
        <Route exact path="/ma-disponibilite" element={<SuspendProfile />} />
        <Route path="/*" element={<Navigate to="/psychologue/tableau-de-bord" />} />
      </Routes>
    </Page>
  );
};

export default observer(PsychologistRouter);
