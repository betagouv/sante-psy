import React, { useEffect, useRef, useState } from 'react';

// Inspired from https://github.com/metabase/sso-examples/blob/master/app-embed-example/src/MetabaseAppEmbed.js
const MetabaseAppEmbed = ({
  title = 'Metabase',
  className,
  style = {},
  base = '',
  path = '/',
  onMessage,
  onLocationChange,
  onFrameChange,
  getAuthUrl,
  fitHeight,
}) => {
  // ref for the iframe HTML element
  const iframeEl = useRef(null);
  // ref for the current `src` attribute
  const src = useRef(`${base}${path}`);
  // ref for the current location, as reported via postMessage
  const location = useRef(null);
  const [frame, setFrame] = useState();

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
          setFrame(e.data.metabase.frame);
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

  const frameMode = frame && frame.mode;
  let height;
  if (frameMode === 'normal') {
    height = frame.height;
  } else if (frameMode === 'fit') {
    height = fitHeight;
  }

  return (
    <iframe
      ref={iframeEl}
      src={src.current}
      title={title}
      className={className}
      style={{ border: 'none', width: '100%', height, ...style }}
    />
  );
};

export default MetabaseAppEmbed;
