import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react';

import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import Header from 'components/Header/Header';
import Skiplinks from 'components/Header/Skiplinks';
import Matomo from 'components/Matomo/Matomo';
import Landing from 'components/Landing/Landing';
import Footer from 'components/Footer/Footer';

import Logout from 'components/Login/Logout';
import Login from 'components/Login/Login';
import Faq from 'components/Faq/Faq';
import CGU from 'components/CGU/CGU';
import AccessibilityActionPlan from 'components/AccessibilityDeclaration/AccessibilityActionPlan';
import AccessibilityDeclaration from 'components/AccessibilityDeclaration/AccessibilityDeclaration';
import PrivacyPolicy from 'components/PrivacyPolicy/PrivacyPolicy';
import LegalNotice from 'components/LegalNotice/LegalNotice';
import Statistics from 'components/Statistics/Statistics';
import PsyListing from 'components/PsyListing/PsyListing';
import PublicPsychologistProfile from 'components/PsyListing/PublicPsychologistProfile';
import Contact from 'components/Contact/Contact';

import agent from 'services/agent';

import { useStore } from 'stores/';

import './colors.css';
import './App.css';

import InactiveProfile from 'components/Psychologist/PsyDashboard/PsySection/InactiveProfile';
import ActiveProfile from 'components/Psychologist/PsyDashboard/PsySection/ActiveProfile';
import StudentLanding from 'components/Landing/StudentLanding';
import StudentNewsletterAnswer from 'components/StudentNewsletterAnswer/StudentNewsletterAnswer';
import OtherServicesPage from 'components/OtherServices/OtherServicesPage';
import PublicAnnouncement from 'components/Notification/PublicAnnouncement';
import LiveChat from 'components/LiveChat/LiveChat';
import ContactForm from 'components/Contact/ContactForm';
import Podcast from 'components/Podcast/Podcast';
import StudentSignInStepOne from 'components/Students/StudentSignIn/StudentSignInStepOne';
import StudentSignInStepTwo from 'components/Students/StudentSignIn/StudentSignInStepTwo';
import StudentHomepage from 'components/Students/Homepage';
import StudentNewsletterUnregister from './components/StudentNewsletterUnregister/StudentNewsletterUnregister';
import StudentEligibility from './components/Eligibility/EligibilityFunnel';
import StudentRouter from './StudentRouter';

const PsychologistRouter = React.lazy(() => import('./PsychologistRouter'));

function App() {
  const { commonStore: { setConfig }, userStore: { user, pullUser, role } } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Config.get().then(response => setConfig(response.data));
    pullUser().finally(() => setLoading(false));
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <>
      {__MATOMO__ && <Matomo />}
      <Skiplinks />
      <PublicAnnouncement />
      <Header />
      <ScrollToTop loading={loading} />
      <LiveChat />
      <div id="contenu">
        {!loading && (
          <React.Suspense fallback={null}>
            <Routes>
              <Route exact path="/activation/:token" element={<ActiveProfile />} />
              <Route exact path="/suspension/:token" element={<InactiveProfile />} />
              <Route exact path="/psychologue/logout" element={<Logout />} />
              <Route exact path="/login/:token" element={<Login />} />
              <Route exact path="/login/" element={<Login />} />
              <Route exact path="/trouver-un-psychologue" element={<PsyListing />} />
              <Route exact path="/trouver-un-psychologue/:psyId" element={<PublicPsychologistProfile />} />
              <Route exact path="/mentions-legales" element={<LegalNotice />} />
              <Route exact path="/declaration-accessibilite" element={<AccessibilityDeclaration />} />
              <Route exact path="/declaration-accessibilite/plan-action" element={<AccessibilityActionPlan />} />
              <Route exact path="/cgu" element={<CGU />} />
              <Route exact path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
              <Route exact path="/faq" element={<Faq />} />
              <Route exact path="/stats" element={<Statistics />} />
              <Route exact path="/contact" element={<Contact />} />
              <Route exact path="/contact/formulaire" element={<ContactForm />} />
              <Route exact path="/autres-services" element={<OtherServicesPage />} />
              <Route exact path="/podcast" element={<Podcast />} />
              <Route exact path="/etudiant" element={<StudentLanding />} />
              <Route exact path="/etudiant/accueil" element={<StudentHomepage />} />
              <Route exact path="/inscription" element={<StudentSignInStepOne />} />
              <Route exact path="/inscription/:token" element={<StudentSignInStepTwo />} />
              <Route exact path="/enregistrement/:id" element={<StudentNewsletterAnswer />} />
              <Route exact path="/desinscription/:id" element={<StudentNewsletterUnregister />} />
              <Route exact path="/eligibilite" element={<StudentEligibility />} />
              <Route exact path="/" element={<Landing />} />
              <Route
                path="/psychologue/*"
                element={user && role === 'psy' ? <PsychologistRouter /> : <Navigate to="/login" />}
              />
              <Route
                path="/etudiant/*"
                element={user && role === 'student' ? <StudentRouter /> : <Navigate to="/login" />}
              />
              <Route path="/*" element={<Navigate to="/" />} />

            </Routes>
          </React.Suspense>
        )}
      </div>
      <Footer />
    </>
  );
}

export default observer(App);
