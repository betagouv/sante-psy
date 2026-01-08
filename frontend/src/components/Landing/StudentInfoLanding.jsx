import React, { useEffect, useRef } from 'react';
import Slice from 'components/Slice/Slice';
import Statistics from './Statistics';

import StudentCards from './StudentCards';
import FollowInstagram from './FollowInstagram';
import Newsletter from './Newsletter';

const StudentInfoLanding = () => {
  const emailRef = useRef();

  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
    // Not set when redirecting
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <div data-test-id="landingPageContainer">
      <Slice
        centerTitle
        centerText
        title={(
          <>
            <b>Étudiantes, étudiants,</b>
            <br />
            Bénéficiez de
            {' '}
            <b>12 séances gratuites</b>
            <div>
              avec un psychologue
            </div>
          </>
        )}
      >
        <Newsletter withTracking withText emailRef={emailRef} />
      </Slice>
      <Slice color="secondary">
        <StudentCards />
      </Slice>
      <Statistics />
      <FollowInstagram />
    </div>
  );
};

export default StudentInfoLanding;
