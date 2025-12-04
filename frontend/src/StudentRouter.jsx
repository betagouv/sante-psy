import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import Page from 'components/Page/Page';

import './custom-month-picker.css';
import './custom-date-picker.css';
import StudentHomepage from 'components/Students/Homepage';

const StudentRouter = () => {
  const { pathname } = useLocation();

  const getPageProps = () => {
    const page = pathname.split('/')[2];
    switch (page) {
      case 'modifier-profil':
        return {
          title: (
            <>
              Mes informations
            </>
          ),
        };
      case 'mes-seances':
        return {
          title: (
            <>
              Liste de mes
              {' '}
              <b>séances</b>
            </>
          ),
          // tutorial: 'appointments',
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
      <Routes>
        <Route exact path="/modifier-profil" element={<StudentHomepage />} />
        <Route exact path="/mes-seances" element={<StudentHomepage />} />
        <Route path="/*" element={<Navigate to="/etudiant/mes-seances" />} />
      </Routes>
    </Page>
  );
};

export default observer(StudentRouter);
