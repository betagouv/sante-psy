import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import StudentHomepage from 'components/Students/Homepage';

import { useStore } from 'stores/';

import './custom-month-picker.css';
import './custom-date-picker.css';
import StudentPage from 'components/Page/StudentPage';

const StudentRouter = () => {
  const { userStore: { user, role } } = useStore();
  const location = useLocation();
  const { pathname } = location;

  if (!user || role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const getPageProps = () => {
    const page = pathname.split('/')[2];
    switch (page) {
      case 'mes-seances':
        return {
          title: (
            <>
              Mes
              {' '}
              <b>séances</b>
            </>
          ),
        };
      default:
        return {};
    }
  };

  return (
    <StudentPage {...getPageProps()}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/etudiant/mes-seances" replace />}
        />
        <Route
          path="/mes-seances"
          element={<StudentHomepage />}
        />
        <Route
          path="/*"
          element={<Navigate to="/etudiant/mes-seances" />}
        />
      </Routes>
    </StudentPage>
  );
};

export default observer(StudentRouter);
