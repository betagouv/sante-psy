import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import { useStore } from 'stores/index';
import styles from './styles.cssmodule.scss';
import MozaicInstagram from './MozaicInstagram';

const InstagramBanner = () => {
  const { commonStore: { config } } = useStore();
  useEffect(() => {
    document.title = 'Santé Psy Étudiant';
  }, []);

  return (
    <div>
      <Slice
        color="white"
        customStyle={{ container: styles.mozaicInstagram, content: styles.content }}
        buttonSecondary
        buttonIcon="ri-instagram-line"
        Component={MozaicInstagram}
        // que du onlyContent si mobile
        title={(
          <b>
            Rejoignez la communauté Instagram
            {' '}
            <span>Santé Psy Étudiant</span>
            &#x00A0;
          </b>
        )}
        y
        description={(
          <>
            <b>{config?.statistics?.nbInstaFollower || '21,5k'}</b>
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
        title={(
          <>
            <b>Podcast</b>
            {' '}
            sur la santé mentale
          </>
        )}
        buttonLink="https://www.instagram.com/kaavan_podcast/"
        buttonText="Kaavan podcast"
      />

      <Slice
        customStyle={{ container: styles.howTo, content: styles.content }}
        title={(
          <>
            Professionnels de santé,
            <br />
            <span>Psychologues</span>
            ,
            <br />
            <b> Comment orienter les étudiants ?</b>
          </>
        )}
      />
    </div>
  );
};

export default observer(InstagramBanner);
