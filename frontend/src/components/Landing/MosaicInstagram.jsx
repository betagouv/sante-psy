import React from 'react';

import '@gouvfr/dsfr/dist/utility/icons/icons-logo/icons-logo.min.css';
import styles from './mosaicInstagram.cssmodule.scss';

// TODO: uninsall react-social-media-embed
const MozaicInstagram = () => {

    const images = [
      '/images/kaavan.png',
      '/images/kaavan.png',
      '/images/kaavan.png',
      '/images/kaavan.png',
      '/images/kaavan.png',
      '/images/kaavan.png',
    ];

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
