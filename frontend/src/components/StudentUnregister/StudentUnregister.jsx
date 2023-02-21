import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slice from 'components/Slice/Slice';
import agent from 'services/agent';

const StudentUnregister = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      agent.Student.unregister(id);
    }
  }, []);

  return (
    <Slice
    color="secondary"
    centerText
    centerTitle
      description={(
        <>
          <div>Ta demande a bien été prise en compte ✅</div>
          <div>Tu ne recevras plus d&lsquo;email de Santé Psy Étudiant 🙂</div>
        </>
      )}
    />
  );
};

export default StudentUnregister;
