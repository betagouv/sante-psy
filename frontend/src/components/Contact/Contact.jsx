import React from 'react';
import { observer } from 'mobx-react';
import Page from 'components/Page/Page';
import ContactCards from './Cards';

const Contact = () => (
  <Page
    textContent
    breadCrumbs={[{ href: '/', label: 'Accueil' }]}
    currentBreadCrumb="Nous contacter"
    title={(
      <>
        Vous avez une
        {' '}
        <b>question</b>
        {' '}
        ?
      </>
      )}
    description={(
      <>
        Consultez nos questions fréquentes,
        la réponse à votre question s&apos;y trouve peut-être.
      </>
      )}
    className="contactPage"
    >
    <ContactCards />
  </Page>
);

export default observer(Contact);
