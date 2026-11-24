import React, { useEffect, useState } from 'react';
import Page from 'components/Page/Page';
import { Button } from '@codegouvfr/react-dsfr/Button';
import Slice from 'components/Slice/Slice';
import styles from './podcast.cssmodule.scss';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const platformLinks = [
  {
    link: 'https://open.spotify.com/show/1SrePWpXUtUhBqGmZsDRPQ',
    icon: 'fr-icon-music-2-line',
    text: 'Spotify',
  },
  {
    link: 'https://podcasts.apple.com/fr/podcast/kaavan-le-podcast-sant%C3%A9-mentale/id1734297354',
    icon: 'fr-icon-macbook-line',
    text: 'Apple Podcasts',
  },
  {
    link: 'https://www.deezer.com/fr/show/1000736372',
    text: 'Deezer',
    icon: 'fr-icon-music-2-line',
  },
  {
    link: 'https://www.youtube.com/@KaavanPodcast',
    text: 'Youtube',
    icon: 'fr-icon-youtube-line',
  },
];
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
        images={
          <div className={styles.imageResized}>
            <img
              src="/images/instagram/kaavan-podcast.png"
              alt="Kaavan podcast"
            />
          </div>
        }
        customStyle={{ container: styles.podcastSlice }}
        title={
          <h2 className={styles.smallerTitle}>
            Explorons le monde de la santé mentale !
          </h2>
        }
        description={
          <div className={styles.smallerDescription}>
            <p>
              Anxiété, mal-être, dépression, hypersensibilité, burn out,
              addictions, troubles alimentaires... préparez-vous à écouter des
              histoires inspirantes, des voix authentiques et des conseils
              pratiques. Que vous soyez vous même touché, ou que vous
              accompagniez un proche. Personnalités, anonymes, experts, on
              plonge ensemble dans des discussions intimes et bienveillantes où
              chacun peut trouver un écho à son propre parcours.
            </p>
            <p>
              Parce que la santé mentale c&apos;est aussi important que la santé
              physique !
            </p>
            <p>
              Retrouvez plus d&apos;épisodes sur toutes vos plateformes
              d&apos;écoute préférées:
            </p>
            <ButtonsGroup
              inlineLayoutWhen="md and up"
              buttons={platformLinks.map((p) => ({
                linkProps: {
                  to: p.link,
                },
                iconId: p.icon,
                children: p.text,
                priority: 'tertiary',
              }))}
            />
          </div>
        }
      >
        <ButtonsGroup
          inlineLayoutWhen="md and up"
          buttons={[
            {
              iconId: 'fr-icon-play-circle-line',
              size: 'small',
              linkProps: {
                to: 'https://linktr.ee/kaavanpodcast',
              },
              children: 'Écouter',
            },
            {
              iconId: 'fr-icon-instagram-line',
              size: 'small',
              linkProps: {
                to: 'https://www.instagram.com/kaavan_podcast/',
              },
              children: 'Suivre',
            },
            {
              iconId: 'fr-icon-signal-tower-fill',
              size: 'small',
              linkProps: {
                to: 'https://feeds.acast.com/public/shows/65cb7c6311e3e5001505d3e6',
              },
              children: 'Flux RSS',
            },
          ]}
        />
      </Slice>
      <iframe
        src="https://embed.acast.com/kaavan-podcast?feed=true&theme=light&wmode=opaque"
        width="100%"
        title="Podcast Kaavan"
        data-embed="true"
        style={{ border: 'none', overflow: 'hidden' }}
        height="726px"
      />

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          iconId="fr-icon-arrow-up-line"
          size="small"
          className={styles.scrollTopButton}
          aria-label="Remonter"
        />
      )}
    </Page>
  );
};

export default Podcast;
