import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import styles from './styles.cssmodule.scss';
import MozaicInstagram from './MozaicInstagram';

const InstagramBanner = () => {
  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div className={styles.container}>
      <Slice
        color="white"
        customStyle={{
          container: styles.mozaicInstagram,
          content: styles.content,
        }}
        buttonSecondary
        buttonIcon="ri-instagram-line"
        Component={MozaicInstagram}
        title={(
          <div className={styles.title}>
            Rejoignez la communauté Instagram
            {' '}
            <span className={styles.yellowUnderline}>Santé Psy Étudiant</span>
            &#x00A0;
          </div>
        )}
        y
        description={(
          <>
            <b>21,5k</b>
            {' '}
            abonnés
            <br />
            Conseils
            <br />
            Témoignages
            <br />
            Podcasts
            <br />
          </>
        )}
        buttonLink="https://www.instagram.com/sante_psyetudiant/?hl=fr"
        buttonText="Santé Psy Étudiant"
      />
      <Slice
        color="white"
        customStyle={{ container: styles.podcast, content: styles.content }}
        reverse
        buttonSecondary
        buttonIcon="ri-instagram-line"
        imageSrc="/images/kaavan.png"
        title={<div className={styles.title}>Podcast sur la santé mentale</div>}
        buttonLink="https://www.instagram.com/kaavan_podcast/"
        buttonText="Kaavan podcast"
      />
    </div>
  );
};

export default observer(InstagramBanner);
