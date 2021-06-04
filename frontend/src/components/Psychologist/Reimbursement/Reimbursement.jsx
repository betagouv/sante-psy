import React, { useEffect, useState } from 'react';

import Mail from 'components/Footer/Mail';
import GlobalNotification from 'components/Notification/GlobalNotification';

import agent from 'services/agent';

import { useStore } from 'stores/';

import Billing from './Billing';
import PayingUniversity from './PayingUniversity';

const Reimbursement = () => {
  const [reimbursement, setReimbursement] = useState();
  const { commonStore: { setNotification } } = useStore();
  useEffect(() => {
    getReimbursment();
  }, []);

  const getReimbursment = () => {
    agent.Reimbursement.get().then(response => {
      setReimbursement(response);
    });
  };

  const updateConvention = convention => {
    setNotification({});
    agent.Reimbursement
      .saveConvention(convention)
      .then(response => {
        setNotification(response);
        getReimbursment();
      });
  };

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w">
      <h1>Remboursement de mes séances</h1>
      <GlobalNotification />
      {reimbursement && (
      <>
        <PayingUniversity
          universities={reimbursement.universities}
          currentConvention={reimbursement.currentConvention}
          updateConvention={updateConvention}
        />
        <Billing total={reimbursement.total} />
      </>
      )}
      <Mail />
    </div>
  );
};

export default Reimbursement;
