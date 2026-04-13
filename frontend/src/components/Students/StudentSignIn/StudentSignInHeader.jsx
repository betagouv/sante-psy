import React from 'react';
import Page from 'components/Page/Page';

const StudentSignInHeader = ({ children, ...props }) => {
  return (
    <Page
      withStats
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      title={
        <>
          Inscription à ton <b>Espace Étudiant</b>
        </>
      }
      {...props}
    >
      {children}
    </Page>
  );
};

export default StudentSignInHeader;
