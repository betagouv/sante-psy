import React, { useEffect, useState } from 'react';

import Mail from 'components/Footer/Mail';
import Notification from 'components/Notification/Notification';

import agent from 'services/agent';

import Billing from './Billing';
import PayingUniversity from './PayingUniversity';

const Reimbursement = () => {
  const [reimbursement, setReimbursement] = useState();
  const [notification, setNotification] = useState({});
  useEffect(() => {
    getReimbursment();
  }, []);

  const getReimbursment = () => {
    agent.Reimbursement.get().then(response => {
      if (response.success) {
        setReimbursement(response);
      } else {
        setNotification(response);
      }
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
      {notification.message && <Notification error={!notification.success} message={notification.message} />}
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
