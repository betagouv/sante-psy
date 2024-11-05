import React, { useEffect, useState } from 'react';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Page from 'components/Page/Page';
import ServicesList from './ServicesList';

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
      title={
        <>
          Autres services <b>à votre écoute</b>
        </>
      }
      description="Vous n’êtes pas éligible au dispositif Santé Psy Etudiant ? Voici d’autres services à votre écoute."
      textContent
    >
      <GlobalNotification />
      <ServicesList small={small} />
    </Page>
  );
};

export default OtherServicesPage;
