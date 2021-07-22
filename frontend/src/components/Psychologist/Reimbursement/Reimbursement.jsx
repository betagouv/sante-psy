import React from 'react';

import Mail from 'components/Footer/Mail';
import GlobalNotification from 'components/Notification/GlobalNotification';

import Billing from './Billing';

const Reimbursement = () => (
  <div className="fr-container fr-mb-3w fr-mt-2w">
    <h1>Remboursement de mes séances</h1>
    <GlobalNotification />
    <Billing />
    <Mail
      withMarge
    />
  </div>
);

export default Reimbursement;
