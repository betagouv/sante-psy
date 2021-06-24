import React from 'react';

import Mail from 'components/Footer/Mail';
import GlobalNotification from 'components/Notification/GlobalNotification';

import Billing from './Billing';
import PayingUniversity from './PayingUniversity';

const Reimbursement = () => (
  <div className="fr-container fr-mb-3w fr-mt-2w">
    <h1>Remboursement de mes séances</h1>
    <GlobalNotification />
    <PayingUniversity />
    <Billing />
    <Mail />
  </div>
);

export default Reimbursement;
