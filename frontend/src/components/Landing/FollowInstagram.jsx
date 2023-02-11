import React from 'react';
import '@gouvfr/dsfr/dist/utility/icons/icons-logo/icons-logo.min.css';
import Slice from 'components/Slice/Slice';

const FollowInstagram = () => (
  <Slice
    color="white"
    imageSrc="/images/communaute.png"
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
        <b>8 000 abonnés sur Instagram.</b>
        {' '}
        Au programme&#x00A0;: conseils, témoignages et accompagnement
        autour de la santé psychologique des étudiants.
      </>
  )}
    buttonLink="https://www.instagram.com/sante_psyetudiant/?hl=fr"
    buttonIcon="ri-instagram-line"
    buttonText="Santé Psy Etudiant sur Instagram"
    buttonSecondary
  />
);

export default FollowInstagram;
