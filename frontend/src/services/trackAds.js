const initAxeptio = () => {
  addScript('/scripts/axeptio.js');
};

const initGoogleAds = () => {
  addScript('/scripts/googleAds.js');
};

const initFacebookAds = () => {
  addScript('/scripts/facebookAds.js');
};

const addScript = src => {
  const el = document.createElement('script');
  el.setAttribute('src', src);
  el.setAttribute('async', true);
  if (document.body !== null) {
    document.body.appendChild(el);
  }
};

const trackGoogleAds = () => {
  window.gtag('event', 'conversion', { send_to: 'AW-10803675495/0jD3CLHYqYMDEOeCzJ8o' });
};

const trackFacebookAds = () => {
  window.fbq('track', 'Contact');
};

module.exports = {
  initAxeptio,
  initGoogleAds,
  initFacebookAds,
  trackGoogleAds,
  trackFacebookAds,
};
