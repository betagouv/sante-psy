import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from 'stores/';

import '@gouvfr/dsfr/dist/utility/icons/icons-logo/icons-logo.min.css';
import Slice from 'components/Slice/Slice';
import styles from './followInstagram.cssmodule.scss';

const FollowInstagram = () => {
  const { commonStore: { config } } = useStore();

  return (
    <Slice
      color="white"
      images={(
        <div className={styles.images}>
          <a href="https://www.instagram.com/p/CoDGlRYoJBn" target="_blank" rel="noreferrer"><img src="/images/communaute-tl.jpg" alt="Choisir son psy" /></a>
          <a href="https://www.instagram.com/p/Cc2dPYBD3M8" target="_blank" rel="noreferrer"><img src="/images/communaute-tr.jpg" alt="Anxiété lié aux examens" /></a>
          <a href="https://www.instagram.com/p/Cj-lUoOIiqv" target="_blank" rel="noreferrer"><img src="/images/communaute-bl.jpg" alt="Déprime ou dépression" /></a>
          <a href="https://www.instagram.com/p/CaxrMELroEb" target="_blank" rel="noreferrer"><img src="/images/communaute-br.jpg" alt="Noholito" /></a>
        </div>
      )}
      centerText
      title={(
        <>
          Rejoignez la communauté
          <br />
          <b>Santé Psy Etudiant</b>
        </>
      )}
      description={(
        <>
          Déjà plus de
          {' '}
          <b>
            {config?.statistics?.nbInstaFollower || '16 000'}
            {' '}
            abonnés sur Instagram.
          </b>
          {' '}
          Au programme&#x00A0;: conseils, témoignages et accompagnement
          autour de la santé psychologique des étudiants.
        </>
      )}
      descriptionDataTestId="followInstagramDescription"
      buttonLink="https://www.instagram.com/sante_psyetudiant/?hl=fr"
      buttonIcon="ri-instagram-line"
      buttonText="Santé Psy Etudiant sur Instagram"
      buttonSecondary
    />
  );
};

export default observer(FollowInstagram);
