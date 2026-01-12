import React, { useEffect, useRef } from 'react';
import Slice from 'components/Slice/Slice';

const StudentHomepage = () => {
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
       />
    </div>
  );
};

export default StudentHomepage;
