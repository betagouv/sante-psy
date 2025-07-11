import React, { useEffect, useState } from 'react';
import Page from 'components/Page/Page';
import styles from './podcast.cssmodule.scss';
import { Button, Icon, Link } from '@dataesr/react-dsfr';
import Slice from 'components/Slice/Slice';

const Podcast = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Page
      title="Kaavan"
      description="Le podcast"
      textContent
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      currentBreadCrumb="Kaavan"
    >
      <Slice
        color="white"
        images={<div className={styles.imageResized}>
          <img src="/images/instagram/kaavan-podcast.png" alt="Kaavan podcast" />
        </div>}
        customStyle={{ container: styles.podcastSlice }}
        title={<h2 className={styles.smallerTitle}>Explorons le monde de la santé mentale !</h2>}
        description={(
          <div className={styles.smallerDescription}>
            <p>Anxiété, mal-être, dépression, hypersensibilité, burn out, addictions, troubles alimentaires... préparez-vous à écouter des histoires inspirantes, des voix authentiques et des conseils pratiques. Que vous soyez vous même touché, ou que vous accompagniez un proche. Personnalités, anonymes, experts, on plonge ensemble dans des discussions intimes et bienveillantes où chacun peut trouver un écho à son propre parcours.</p>
            <p>Parce que la santé mentale c'est aussi important que la santé physique !</p>
            <p>Retrouvez plus d'épisodes sur toutes vos plateformes d'écoute préférées:</p>
            <div className={styles.platformLinks}>
              <a
                href="https://open.spotify.com/show/1SrePWpXUtUhBqGmZsDRPQ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformLink}
              >
                <Icon name="ri-spotify-line" size="sm" />
                Spotify
              </a>
              <span className={styles.separator}>|</span>
              <a
                href="https://podcasts.apple.com/fr/podcast/kaavan-le-podcast-sant%C3%A9-mentale/id1734297354"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformLink}
              >
                <Icon name="ri-apple-line" size="sm" />
                Apple Podcasts
              </a>
              <span className={styles.separator}>|</span>
              <a
                href="https://www.deezer.com/fr/show/1000736372"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformLink}
              >
                <Icon name="ri-music-line" size="sm" />
                Deezer
              </a>
              <span className={styles.separator}>|</span>
              <Link
                href="https://www.youtube.com/@KaavanPodcast"
                target="_blank"
                rel=" "
                title="Youtube"
                className={styles.platformLink}
              >
                <Icon name="ri-youtube-line" size="sm" />
                Youtube
              </Link>
            </div>
          </div>
        )}
      >
        <div className={styles.buttonsContainer}>
          <Button
            icon="ri-play-circle-line"
            iconPosition="left"
            size="sm"
            onClick={() => window.open('https://linktr.ee/kaavanpodcast', '_blank', 'noopener,noreferrer')}
          >
            Écouter
          </Button>
          <Button
            icon="ri-instagram-line"
            iconPosition="left"
            size="sm"
            onClick={() => window.open('https://www.instagram.com/kaavan_podcast/', '_blank', 'noopener,noreferrer')}
          >
            Suivre
          </Button>
          <div className={styles.rssIcon} onClick={() => window.open('https://feeds.acast.com/public/shows/65cb7c6311e3e5001505d3e6', '_blank', 'noopener,noreferrer')}>
            <Icon
              name="ri-signal-tower-fill"
              color="#000091"
              size="lg" />
          </div>
        </div>
      </Slice>
      <iframe
        src="https://embed.acast.com/kaavan-podcast?feed=true&theme=light&wmode=opaque"
        width="100%"
        title="Podcast Kaavan"
        data-embed="true"
        style={{ border: "none", overflow: "hidden" }}
        height="726px"
      />

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
