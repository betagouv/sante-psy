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

import InactiveProfile from 'components/Psychologist/Profile/InactiveProfile';
import ActiveProfile from 'components/Psychologist/Profile/ActiveProfile';
import StudentLanding from 'components/Landing/StudentLanding';
import StudentAnswer from 'components/StudentAnswer/StudentAnswer';
import OtherServices from 'components/OtherServices/OtherServices';
import StudentUnregister from './components/StudentUnregister/StudentUnregister';

const PsychologistRouter = React.lazy(() => import('./PsychologistRouter'));

function App() {
  const { commonStore: { setConfig }, userStore: { user, pullUser } } = useStore();
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
      <Header />
      <ScrollToTop loading={loading} />
      <div id="contenu">
        {!loading && (
          <React.Suspense fallback={null}>
            <Routes>
              <Route exact path="/activation/:token" element={<ActiveProfile />} />
              <Route exact path="/suspension/:token" element={<InactiveProfile />} />
              <Route exact path="/psychologue/logout" element={<Logout />} />
              <Route exact path="/psychologue/login/:token" element={<Login />} />
              <Route exact path="/psychologue/login/" element={<Login />} />
              <Route exact path="/trouver-un-psychologue" element={<PsyListing />} />
              <Route exact path="/trouver-un-psychologue/:psyId" element={<PublicPsychologistProfile />} />
              <Route exact path="/mentions-legales" element={<LegalNotice />} />
              <Route exact path="/declaration-accessibilite" element={<AccessibilityDeclaration />} />
              <Route exact path="/cgu" element={<CGU />} />
              <Route exact path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
              <Route exact path="/faq" element={<Faq />} />
              <Route exact path="/stats" element={<Statistics />} />
              <Route exact path="/contact" element={<Contact />} />
              <Route exact path="/autres-services" element={<OtherServices />} />
              <Route exact path="/etudiant" element={<StudentLanding />} />
              <Route exact path="/enregistrement/:id" element={<StudentAnswer />} />
              <Route exact path="/desinscription/:id" element={<StudentUnregister />} />
              <Route exact path="/" element={<Landing />} />
              <Route
                path="/psychologue/*"
                element={user
                  ? <PsychologistRouter /> : <Navigate to="/psychologue/login" />}
              />
              <Route path="/*" element={<Navigate to={user ? '/psychologue/mes-seances' : '/'} />} />
            </Routes>
          </React.Suspense>
        )}
      </div>
      <Footer />
    </>
  );
}

export default observer(App);
