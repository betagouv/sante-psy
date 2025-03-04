import React from 'react';
import { observer } from 'mobx-react';
import Page from 'components/Page/Page';
import ServicesList from 'components/OtherServices/ServicesList';
import { Button } from '@dataesr/react-dsfr';
import ContactCards from './Cards';
import styles from './contact.cssmodule.scss';

const Contact = () => (
  <>
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
  >
      <ContactCards />
    </Page>
    <Page
      textContent
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
      <ServicesList urgentServices />
    </Page>
    <div className={styles.purpleBanner}>
      <h1 className={styles.smallTitle}>
        Vous ne trouvez pas de
        {' '}
        <b>réponse</b>
        {' '}
        satisfaisante ?
      </h1>
      <p>
        Contactez-nous directement par e-mail pour que nous puissions trouver une solution.
      </p>
      <div>
        <Button
          icon="ri-mail-line"
          iconPosition="right"
          className={styles.button}
          onClick={() => {}}
        >
          Nous contacter par mail
        </Button>
      </div>
    </div>
  </>
);

export default observer(Contact);
