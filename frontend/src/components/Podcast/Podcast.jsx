import React, { useEffect, useState } from 'react';
import Page from 'components/Page/Page';
import styles from './podcast.cssmodule.scss'; // tu peux ajouter les styles là
import { Button } from '@dataesr/react-dsfr';

const Podcast = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400); // seuil d’apparition
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Page breadCrumbs={[{ href: '/', label: 'Accueil' }]} currentBreadCrumb="Podcast Kaavan">
      <div className={styles.iframeContainer}>
        {/* <iframe
          src="https://feeds.acast.com/public/shows/kaavan-podcast"
          width="100%"
          frameBorder="0"
          scrolling="no"
          title="Podcast Kaavan"
          className={styles.iframeShifted}
        /> */}
        <iframe 
          src="https://embed.acast.com/$/kaavan-podcast/le-pouvoir-de-la-pensee-positive-avec-alexandra-rosenfeld?" 
          frameBorder="0" 
          width="100%" 
          height="110px">
        </iframe>
      </div>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          icon="fr-icon-arrow-up-line"
          size="sm"
          className={styles.scrollTopButton}
          aria-label="Remonter"
        />
      )}
    </Page>
  );
};

export default Podcast;
