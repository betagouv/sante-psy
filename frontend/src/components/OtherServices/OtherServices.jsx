import GlobalNotification from 'components/Notification/GlobalNotification';
import Page from 'components/Page/Page';
import React from 'react';
import Service from './Service';
import styles from './service.cssmodule.scss';

const OtherServices = () => (
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
    <div className={styles.services}>
      <Service
        image="/images/nightline.png"
        logo="/images/nightline-logo.png"
        name="Nightline"
        title="Par et pour les étudiant.e.s"
        description="Association qui oeuvre pour la santé mentale des étudiants."
        link="https://www.nightline.fr/"
      />
      <Service
        image="/images/psycom.png"
        logo="/images/psycom-logo.png"
        name="Le Psycom"
        title="Organisme public d'information sur la santé mentale."
        description="Pour mieux comprendre et mieux se renseigner sur la santé mentale."
        link="https://www.psycom.org/"
      />
      <Service
        image="/images/3114.png"
        logo="/images/3114-logo.png"
        name="Le 3114"
        title="En détresse ? Témoin d’un proche en souffrance ?"
        description="Des professionnels de santé formés à la prévention du suicide vous écoutent. Ils peuvent proposer des ressources adaptées à vos besoins."
        link="https://3114.fr/"
      />
      <Service
        image="/images/monparcourspsy.png"
        logo="/images/monparcourspsy-logo.png"
        name="MonParcoursPsy"
        title="En parler, c'est déjà se soigner."
        description="Pour tout le monde, à partir de 3 ans. 8 séances par an chez un(e) psychologue"
        link="https://monparcourspsy.sante.gouv.fr/"
      />
    </div>
  </Page>
);

export default OtherServices;
