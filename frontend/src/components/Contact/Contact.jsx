import React from 'react';
import { observer } from 'mobx-react';
import Page from 'components/Page/Page';
import ServicesList from 'components/OtherServices/ServicesList';
import { Button, Row } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import Card from 'components/Card/Card';
import styles from './contact.cssmodule.scss';

const cards = [
  { imgSrc: 'student', title: 'Je suis étudiant', section: 'etudiant' },
  { imgSrc: 'psychologist', title: 'Je suis psychologue', section: 'psychologue' },
  { imgSrc: 'university', title: 'Je suis une école', section: 'ecole' },
];

const contactCardStyle = {
  card: 'contactCard',
  image: 'contactCardImg',
  title: 'contactCardTitle',
};

const Contact = () => {
  const navigate = useNavigate();

  return (
    <>
      <Page
        textContent
        breadCrumbs={[{ href: '/', label: 'Accueil' }]}
        currentBreadCrumb="Nous contacter"
        title={(
          <>
            <b>Vous avez une question</b>
            {' '}
            ?
          </>
)}
        description={<>Consultez nos questions fréquentes, la réponse à votre question s&apos;y trouve peut-être.</>}
      >
        <Row className={styles.cardContainer}>
          {cards.map(card => (
            <Card
              customStyles={contactCardStyle}
              key={card.section}
              title={card.title}
              image={`contact/${card.imgSrc}.png`}
              link={`/faq?section=${card.section}`}
              fullClickable
    />
          ))}
        </Row>
      </Page>
      <Page
        textContent
        title={(
          <>
            <b>Besoin d&apos;une écoute</b>
            {' '}
            immédiate
          </>
)}
        description={<>Plusieurs lignes d&apos;écoute sont là pour t&apos;écouter et te conseiller</>}
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
          Contactez-nous directement par email pour que nous puissions trouver une solution.
        </p>
        <div className={styles.hover}>
          <Button
            secondary
            icon="ri-mail-line"
            iconPosition="right"
            className={styles.button}
            onClick={() => navigate('/contact/formulaire')}
          >
            Nous contacter par email
          </Button>
        </div>
      </div>
    </>
  );
};

export default observer(Contact);
