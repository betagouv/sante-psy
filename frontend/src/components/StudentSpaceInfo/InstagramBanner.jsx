import React from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import { useStore } from 'stores/index';
import styles from './studentSpaceInfo.cssmodule.scss';

const InstagramBanner = () => {
  const { commonStore: { config } } = useStore();

  return (
    <div className={styles.instaWrapper}>
      <Slice
        color="white"
        imageSrc="/images/studentSpace/instaBanner.png"
        title={(
          <>
            Rejoins la communauté Santé Psy Étudiant
          </>
        )}
        description={(
          <div className={styles.instaDescription}>
            <p>
              Déjà plus de
              {config?.statistics?.nbInstaFollower || '29 000'}
              {' '}
              abonnés sur Instagram
            </p>
            <p>Au programme : conseils, témoignages et accompagnement autour de la santé psychologique des étudiants.</p>
          </div>
        )}
        buttonLink="https://www.instagram.com/sante_psyetudiant/?hl=fr"
        buttonIcon="ri-instagram-line"
        buttonText="Santé Psy Etudiant sur Instagram"
        buttonSecondary
      />
    </div>
  );
};

export default observer(InstagramBanner);
