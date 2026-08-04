import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import agent from 'services/agent';
import StudentSignInHeader from './StudentSignInHeader';
import StudentQuestionnaire from '../Questionnaire/StudentQuestionnaire';

const StudentSignInQuestionnaire = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate('/inscription', { replace: true });
    }
  }, [location.state, navigate]);

  const { email, ine, firstNames, lastName, dateOfBirth, apiInesCheck } =
    location.state || {};

  const signIn = async (res) => {
    const {
      schoolType,
      schoolName,
      schoolPostcode,
      studyLevel,
      studyField,
      studyFieldOther,
      gender,
      livingPostcode,
    } = res;
    try {
      await agent.Student.signIn({
        firstNames,
        lastName,
        dateOfBirth,
        ine,
        email,
        acceptedCGUs: true,
        schoolType,
        schoolName,
        schoolPostcode,
        studyLevel,
        studyField,
        studyFieldOther,
        gender,
        livingPostcode,
        apiInesCheck,
      });
      navigate('/inscription/success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StudentSignInHeader>
      <StudentQuestionnaire onFinish={signIn} />
    </StudentSignInHeader>
  );
};

export default StudentSignInQuestionnaire;
