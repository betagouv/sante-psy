import React from 'react';

import Slice from 'components/Slice/Slice';
import StudentCards from './StudentCards';

const StudentProcess = () => (
  <Slice
    color="secondary"
    centerText
    centerTitle
    title={(
      <>
        Échangez
        {' '}
        <b>gratuitement</b>
        <br />
        {' '}
        avec un psychologue
      </>
    )}
    description="Comment ça marche&#x00A0;?"
  >
    <StudentCards />
  </Slice>
);

export default StudentProcess;
