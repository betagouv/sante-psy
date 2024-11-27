/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
const initAxeptio = () => {
  window.axeptioSettings = {
    clientId: '619fa94adcbb4a6f8f3ca556',
    cookiesVersion: 'V1.0',
  };

  (function (d, s) {
    const t = d.getElementsByTagName(s)[0]; const
      e = d.createElement(s);
    e.async = true; e.src = '//static.axept.io/sdk-slim.js';
    t.parentNode.insertBefore(e, t);
  }(document, 'script'));
};

function gtag() { window.dataLayer.push(arguments); }

const initGoogleAds = token => {
  const el = document.createElement('script');
  el.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${token}`);
  el.setAttribute('async', true);
  if (document.body !== null) {
    document.body.appendChild(el);
  }

  window.dataLayer = window.dataLayer || [];

  gtag('js', new Date());
  gtag('config', token);
};

const removeGoogleAds = () => {
  if (window.dataLayer) {
    delete (window.dataLayer);
  }
};

const initFacebookAds = () => {
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js',
  ));
  window.fbq('init', '3078857952370640');
};

const removeFacebookAds = () => {
  if (window.fbq) {
    delete (window.fbq);
  }
};

const trackGoogleAds = (token, value) => {
  gtag('event', 'conversion', { send_to: `${token}` }, value);
};

const trackFacebookAds = () => {
  window.fbq('track', 'Contact');
};

module.exports = {
  initAxeptio,
  initGoogleAds,
  initFacebookAds,
  removeGoogleAds,
  removeFacebookAds,
  trackGoogleAds,
  trackFacebookAds,
};
