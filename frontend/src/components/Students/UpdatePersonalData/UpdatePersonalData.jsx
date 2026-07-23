import React from 'react';
import { useStore } from 'stores/index';
import StudentQuestionnaire from '../Questionnaire/StudentQuestionnaire';
import Page from 'components/Page/Page';

const UpdatePersonalData = () => {
  const {
    userStore: { user },
  } = useStore();

  const defaultValues = {
    acceptedCGUs: user.has_accepted_cgu,
    schoolType: user.school_type,
    schoolName: user.school_name,
    schoolPostcode: user.school_postcode,
    studyLevel: user.study_level,
    studyField: user.study_field,
    studyFieldOther: user.study_field_other,
    gender: user.gender,
    livingPostcode: user.living_postcode,
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
        onFinish={() => console.log('hello')}
        defaultValues={defaultValues}
        nextLabel="Confirmer mes informations"
      />
    </Page>
  );
};

export default UpdatePersonalData;
