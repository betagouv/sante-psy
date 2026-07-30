import React from 'react';
import { useStore } from 'stores/index';
import StudentQuestionnaire from '../Questionnaire/StudentQuestionnaire';
import Page from 'components/Page/Page';
import agent from 'services/agent';
import { useNavigate } from 'react-router-dom';

const UpdatePersonalData = () => {
  const {
    userStore: { user, pullUser },
  } = useStore();
  const navigate = useNavigate();

  const defaultValues = {
    acceptedCGUs: user.has_accepted_cgu,
    schoolType: user.school_type,
    schoolName: user.school_name,
    schoolPostcode: user.school_postcode,
    studyField: user.study_field,
    studyFieldOther: user.study_field_other,
    gender: user.gender,
    livingPostcode: user.living_postcode,
  };

  const updateData = async (res) => {
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
      await agent.Student.updatePersonalData(user.id, {
        acceptedCGUs: true,
        schoolType,
        schoolName,
        schoolPostcode,
        studyLevel,
        studyField,
        studyFieldOther,
        gender,
        livingPostcode,
      });
      await pullUser();
      navigate('/etudiant');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page
      title={
        <>
          Rentrée 2026 : mets à jour ton <b>espace étudiant</b>
        </>
      }
      description="D'une année à l'autre, ta situation peut changer : on fait le point avec toi."
    >
      <StudentQuestionnaire
        onFinish={updateData}
        defaultValues={defaultValues}
        newStudent={false}
      />
    </Page>
  );
};

export default UpdatePersonalData;
