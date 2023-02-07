import React from 'react';

import Slice from 'components/Slice/Slice';
import StudentCards from './StudentCards';

const StudentProcess = () => (
  <Slice
    color="secondary"
    centerText
    title={(
      <>
        Échangez
        {' '}
        <b>gratuitement</b>
        {' '}
        avec un psychologue
      </>
    )}
    description="Comment ça marche ?"
  >
    <StudentCards />
  </Slice>
);

export default StudentProcess;
