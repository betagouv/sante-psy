import React, { useEffect, useRef, useState } from 'react';

// Inspired from https://github.com/metabase/sso-examples/blob/master/app-embed-example/src/MetabaseAppEmbed.js
const MetabaseAppEmbed = ({
  title = 'Metabase',
  className,
  base = '',
  path = '/',
  onMessage,
  onLocationChange,
  onFrameChange,
  getAuthUrl,
}) => {
  // ref for the iframe HTML element
  const iframeEl = useRef(null);
  // ref for the current `src` attribute
  const src = useRef(`${base}${path}`);
  // ref for the current location, as reported via postMessage
  const location = useRef(null);

  // setup postMessage listener
  useEffect(() => {
    const handleMessage = e => {
      if (e.source === iframeEl.current.contentWindow && e.data.metabase) {
        // sync the location ref
        if (e.data.metabase.type === 'location') {
          const { pathname, search, hash } = e.data.metabase.location;
          location.current = [pathname, search, hash].join('');
          if (onLocationChange) {
            onLocationChange(e.data.metabase.location);
          }
        } else if (e.data.metabase.type === 'frame') {
          if (onFrameChange) {
            onFrameChange(e.data.metabase.frame);
          }
        }
        if (onMessage) {
          onMessage(e.data.metabase);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (location.current == null) {
    // location syncing not enabled, update src
    src.current = `${base}${path}`;
  } else if (location.current !== path) {
    // location syncing enabled, use postMessage to update location
    iframeEl.current.contentWindow.postMessage(
      {
        metabase: {
          type: 'location',
          location: path,
        },
      },
      'https://stats.santepsyetudiant.beta.gouv.fr',
    );
  }

  // on first load replace the src with the auth URL, if any
  if (getAuthUrl && !iframeEl.current) {
    src.current = getAuthUrl(src.current);
  }

  return (
    <iframe
      ref={iframeEl}
      src={src.current}
      title={title}
      className={className}
    />
  );
};

export default MetabaseAppEmbed;
