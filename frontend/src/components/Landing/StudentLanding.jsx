import React, { useEffect, useRef } from 'react';
import Slice from 'components/Slice/Slice';
import Statistics from './Statistics';

import StudentCards from './StudentCards';
import FollowInstagram from './FollowInstagram';
import Newsletter from './Newsletter';

const StudentLanding = () => {
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
        color="secondary"
        centerText
        title={(
          <>
            Étudiantes, étudiants,
            <br />
            Bénéficiez de
            {' '}
            <b>8 séances gratuites</b>
            <div>
              avec un psychologue.
            </div>
          </>
        )}
      >
        <Newsletter withTracking emailRef={emailRef} />
        <div className="fr-mt-4w" />
        <StudentCards />
      </Slice>
      <Statistics />
      <FollowInstagram />
    </div>
  );
};

export default StudentLanding;
