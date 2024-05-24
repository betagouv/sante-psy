import GlobalNotification from 'components/Notification/GlobalNotification';
import Page from 'components/Page/Page';
import React, { useEffect, useState } from 'react';
import OtherServices from './OtherServices';

const OtherServicesPage = () => {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    function handleResize() {
      setSmall(window.innerWidth < 769);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Page
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      currentBreadCrumb="Autres services"
      title={(
        <>
          Autres services
          {' '}
          <b>à votre écoute</b>
        </>
    )}
      description="Vous n’êtes pas éligible au dispositif Santé Psy Etudiant ? Voici d’autres services à votre écoute."
      textContent
    >
      <GlobalNotification />
      <OtherServices />
    </Page>
  );
};

export default OtherServicesPage;
