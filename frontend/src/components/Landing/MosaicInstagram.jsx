import React, { useEffect } from 'react';

import '@gouvfr/dsfr/dist/utility/icons/icons-logo/icons-logo.min.css';
import styles from './mosaicInstagram.cssmodule.scss';
import agent from 'services/agent';

// TODO: uninsall react-social-media-embed
const MozaicInstagram = () => {

  const images = [
    'C2aRBUoIeeS',
    'C2ITRZloMNs',
    'C1mt5xlIPXS',
    'CzeRhrkCCCJ',
    'C0mUON-IwJx',
    'Crv88_xouDS',
  ];

  useEffect(() => {
    // agent.Instagram.get({postsIds: postsIds}).then((response) => {
    //   console.log(response);
    // });
  });
  

  return (
    <div className={styles.mosaicGrid}>
        {images.map((src, index) => (
          <div key={index} className={styles.imageItem}>
            <img src={src} alt={`Image ${index + 1}`} />
          </div>
        ))}
    </div>    
  );
};

export default MozaicInstagram;
