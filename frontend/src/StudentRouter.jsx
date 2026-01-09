import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react';

import StudentHomepage from 'components/Students/Homepage';

import './custom-month-picker.css';
import './custom-date-picker.css';
import StudentPage from 'components/Page/StudentPage';

const StudentRouter = () => {
  return (
    <StudentPage title="Espace étudiant">
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/etudiant/accueil" replace />}
        />
        <Route
          path="/accueil"
          element={<StudentHomepage />}
        />
        <Route
          path="/*"
          element={<Navigate to="/etudiant/accueil" />}
        />
      </Routes>
    </StudentPage>
  );
};

export default observer(StudentRouter);
