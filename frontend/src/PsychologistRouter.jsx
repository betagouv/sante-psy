import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';

import Announcement from 'components/Notification/Announcement';
import Appointments from 'components/Psychologist/Appointments/Appointments';
import NewAppointment from 'components/Psychologist/Appointments/NewAppointment';
import Patients from 'components/Psychologist/Patients/Patients';
import AddEditPatient from 'components/Psychologist/Patients/AddEditPatient';
import PsyProfile from 'components/Psychologist/Profile/PsyProfile';
import Page from 'components/Page/Page';
import Notification from 'components/Notification/Notification';
import ConventionModal from 'components/Psychologist/Appointments/ConventionModal';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Billing from 'components/Psychologist/Reimbursement/Billing';

import { shouldCheckConventionAgain } from 'services/conventionVerification';
import { useStore } from './stores';

import 'react-month-picker/css/month-picker.css';
import './custom-month-picker.css';
import './custom-date-picker.css';

const PsychologistRouter = () => {
  const { userStore: { user } } = useStore();
  const { pathname } = useLocation();

  const hasSignedConvention = user.convention && user.convention.isConventionSigned;
  const modal = hasSignedConvention || !shouldCheckConventionAgain()
    ? <></>
    : <ConventionModal currentConvention={user.convention} />;

  const getPageProps = () => {
    const page = pathname.split('/')[2];
    switch (page) {
      case 'nouvelle-seance':
        return {
          title: 'Nouvelle séance',
          description: 'Vous avez réalisé une séance avec un étudiant ou une étudiante. Renseignez-la sur cette page.',
        };
      case 'mes-etudiants':
        return {
          title: 'Gérer mes étudiants',
          description: 'Veuillez enregistrer vos nouveaux étudiants afin de déclarer leurs séances pour procéder à vos remboursements.',
          tutorial: 'students',
        };
      case 'nouvel-etudiant':
        return {
          title: 'Nouvel étudiant',
          description: 'Déclarez un étudiant comme étant patient du dispositif Santé Psy Étudiant. Vous pourrez ensuite déclarer les séances réalisées avec cet étudiant.',
        };
      case 'modifier-etudiant':
        return { title: "Compléter les informations de l'étudiant" };
      case 'mes-remboursements':
        return {
          title: 'Gérer mes facturations',
          description: 'Vous pouvez éditer et générer vos factures sur cet espace avant de les envoyer au Service de Santé Universitaire afin de vous faire rembourser.',
        };
      case 'mon-profil':
        return {
          title: 'Mes informations',
          description: 'En tant que psychologue de Santé Psy Étudiant, vous avez la possibilité de gérer les informations au sein de notre annuaire.',
        };
      default:
        return {
          title: 'Déclarer mes séances',
          description: 'La déclaration des séances en ligne est nécessaire à votre remboursement.',
          tutorial: 'appointments',
        };
    }
  };

  return (
    <Page
      {...getPageProps()}
      background="blue"
      withContact
      withNotification
    >
      {modal}
      <Announcement />
      {user.convention && user.convention.isConventionSigned === null && (
        <Notification type="info">
          Veuillez indiquer l&lsquo;état de votre conventionnement sur la page
          {' '}
          <HashLink to="/psychologue/mon-profil">Mes informations</HashLink>
        </Notification>
      )}
      {user && !user.active && (
        <Notification type="info">
          Votre profil n&lsquo;est plus visible dans l&lsquo;annuaire.
          Pour que les étudiants puissent vous contacter, rendez vous sur la page
          {' '}
          <HashLink to="/psychologue/mon-profil">Mes informations</HashLink>
          .
        </Notification>
      )}
      <GlobalNotification className="fr-my-2w" />
      <Switch>
        <Route exact path="/psychologue/mes-seances" component={Appointments} />
        <Route exact path="/psychologue/nouvelle-seance/:patientId?" component={NewAppointment} />
        <Route exact path="/psychologue/mes-etudiants" component={Patients} />
        <Route exact path="/psychologue/nouvel-etudiant" component={AddEditPatient} />
        <Route exact path="/psychologue/modifier-etudiant/:patientId" component={AddEditPatient} />
        <Route exact path="/psychologue/mes-remboursements" component={Billing} />
        <Route path="/psychologue/mon-profil" component={PsyProfile} />
        <Route path="/psychologue/">
          <Redirect to="/psychologue/mes-seances" />
        </Route>
      </Switch>
    </Page>
  );
};

export default observer(PsychologistRouter);
