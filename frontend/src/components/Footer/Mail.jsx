import React from 'react';

import { useStore } from 'stores/';

const Mail = () => {
  const { commonStore: { config } } = useStore();
  return (
    <div className="fr-my-4w">
      Des questions ? Une difficulté ? Envoyez-nous un email à
      {' '}
      <b>{config.contactEmail}</b>
    </div>
  );
};

export default Mail;
