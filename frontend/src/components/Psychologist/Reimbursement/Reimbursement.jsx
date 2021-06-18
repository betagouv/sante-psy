import React, { useEffect, useState } from 'react';

import Mail from 'components/Footer/Mail';
import GlobalNotification from 'components/Notification/GlobalNotification';

import agent from 'services/agent';

import Billing from './Billing';
import PayingUniversity from './PayingUniversity';

const Reimbursement = () => {
  const [reimbursement, setReimbursement] = useState();
  useEffect(() => {
    getReimbursment();
  }, []);

  const getReimbursment = () => {
    agent.Reimbursement.get().then(response => {
      setReimbursement(response);
    });
  };

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w">
      <h1>Remboursement de mes séances</h1>
      <GlobalNotification />
      {reimbursement && (
      <>
        <PayingUniversity />
        <Billing total={reimbursement.total} />
      </>
      )}
      <Mail />
    </div>
  );
};

export default Reimbursement;
