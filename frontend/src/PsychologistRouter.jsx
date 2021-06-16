import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Appointments from 'components/Psychologist/Appointments/Appointments';
import NewAppointment from 'components/Psychologist/Appointments/NewAppointment';
import Reimbursement from 'components/Psychologist/Reimbursement/Reimbursement';
import Patients from 'components/Psychologist/Patients/Patients';
import AddEditPatient from 'components/Psychologist/Patients/AddEditPatient';
import PsyProfile from 'components/Psychologist/Profile/PsyProfile';

const PsychologistRouter = () => (
  <Switch>
    <Route exact path="/psychologue/mes-seances" component={Appointments} />
    <Route exact path="/psychologue/nouvelle-seance" component={NewAppointment} />
    <Route exact path="/psychologue/mes-patients" component={Patients} />
    <Route exact path="/psychologue/nouveau-patient" component={AddEditPatient} />
    <Route exact path="/psychologue/modifier-patient/:patientId" component={AddEditPatient} />
    <Route exact path="/psychologue/mes-remboursements" component={Reimbursement} />
    <Route path="/psychologue/mon-profil" component={PsyProfile} />
    <Route path="/psychologue/">
      <Redirect to="/psychologue/mes-seances" />
    </Route>
  </Switch>
);

export default PsychologistRouter;
