import React from 'react';
import styles from './styles.cssmodule.scss';

const MozaicInstagram = () => {
  const images = [
    { name: 'instaMozaic1', href: 'https://www.instagram.com/p/Cz_rFlGIv0B/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==' },
    { name: 'instaMozaic2', href: 'https://www.instagram.com/p/C9CQne_oQNb/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
    { name: 'instaMozaic3', href: 'https://www.instagram.com/p/C768qekI4uh/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
    { name: 'instaMozaic4', href: 'https://www.instagram.com/p/C5qD70jI7BT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
    { name: 'instaMozaic5', href: 'https://www.instagram.com/p/C6MTi9xIyJy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
    { name: 'instaMozaic6', href: 'https://www.instagram.com/reel/CzeRhrkCCCJ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  ];

  return (
    <div className={styles.mozaicGrid}>
      {images.map(image => (
        <div className={styles.imageItem}>
          <a href={image.href} target="_blank" rel="noopener noreferrer" className={styles.href}>
            <img src={`images/${image.name}.jpg`} alt="Santé Psy Etudiant instagram post" />
          </a>
        </div>
      ))}
    </div>
  );
};

export default MozaicInstagram;
