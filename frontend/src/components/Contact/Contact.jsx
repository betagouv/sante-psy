import React from 'react';
import { observer } from 'mobx-react';
import Page from 'components/Page/Page';
import ContactCards from './Cards';
import ServicesList from 'components/OtherServices/ServicesList';

const Contact = () => (
  <><Page
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
  >
    <ContactCards />
  </Page><Page
    textContent
    breadCrumbs={[{ href: '/', label: 'Accueil' }]}
    currentBreadCrumb="Nous contacter"
    title={(
      <>
        Besoin d&apos;une
        {' '}
        <b>écoute</b>
        {' '}
        immédiate
      </>
    )}
    description={(
      <>
        Plusieurs lignes d&apos;écoute sont là pour t&apos;écouter et te conseiller
      </>
    )}
  >
    <ServicesList urgentServices={true} />
    </Page>
    </>
);

export default observer(Contact);
