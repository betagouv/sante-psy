import React from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import styles from './studentSpaceInfo.cssmodule.scss';
import CardsBanner from './CardsBanner';
import Faq from 'components/Faq/Faq';
import InstagramBanner from './InstagramBanner';

const StudentSpaceInfo = () => {
  return (
    <div>
      <Slice
        customStyle={{
          content: styles.sliceContentNormal,
        }}
        title={(
          <>
            Ton
            {' '}
            <b>Espace Étudiant</b>
          </>
        )}
        description="Un espace personnel pour t'aider à prendre soin de ta santé mentale"
      />
      <div className={styles.sliceContainer}>
        <div className={styles.sliceContent}>
          <div className={styles.textContent}>
            <p>
              L'espace étudiant de Santé Psy Étudiant est un
              espace personnel et sécurisé, pensé pour
              t'accompagner tout au long de ton parcours, à
              ton rythme.
            </p>
            <p>
              Il te permet de mieux comprendre ce que tu
              traverses, de suivre tes démarches et de
              retrouver facilement les ressources qui peuvent
              t'aider.
            </p>
          </div>
          <img src='/images/studentSpace/student-space-history.png' alt='student space history of appointments' />
        </div>
      </div>
      <CardsBanner />
      <Slice
        customStyle={{
          content: styles.sliceContentNormal,
        }}
        title={(
          <>
            Un espace
            {' '}
            <b>personnel</b>
            , simple et sécurisé
          </>
        )}
        description="Un espace personnel pour t'aider à prendre soin de ta santé mentale"
      />
      <Slice
        customStyle={{
          container: styles.sliceContainerSecondary,
        }}
        color='secondary'
        description={
          <div className={styles.secondaryContent}>
            <p>
              L'espace étudiant est accessible via une <b>connexion avec ton adresse mail</b>.
            </p>
            <p>
              Toutes les informations que tu y retrouves sont confidentielles et protégées.
            </p>
            <ul>
              <li>Tu peux choisir ce que tu utilises</li>
              <li>Tu peux te connecter quand tu veux</li>
              <li>Tu peux arrêter à tout moment</li>
              <li>Rien n'est partagé sans ton accord</li>
            </ul>
          </div>
        }
      />
      <div>
        <Slice
          customStyle={{
            content: styles.sliceContentNormal,
          }}
          title={(
            <>
              <b>Prêt à créer ton espace étudiant ?</b>
            </>
          )}
          description={(
            <>
              Créer ton espace ne prend que quelques minutes.
              {' '}
              Et si ce n'est pas le bon moment, tu pourras toujours y revenir plus tard.
            </>
          )}
          buttonLink="/inscription"
          buttonText="Créer mon espace"
        />
      </div>
      <Faq simplified />
      <InstagramBanner />
    </div>
  );
};

export default observer(StudentSpaceInfo);
