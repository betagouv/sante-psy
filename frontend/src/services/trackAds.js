const initGoogleAds = () => {
  var el = document.createElement('script');
  el.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=AW-10803675495');
  el.setAttribute('async', true);
  if (document.body !== null) {
    document.body.appendChild(el);
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'AW-10803675495');
}

const initFacebookPixel = () => {
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
  }(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '3078857952370640');
}

const trackGoogleAds = () => {
  window.gtag('event', 'conversion', { send_to: 'AW-10803675495/0jD3CLHYqYMDEOeCzJ8o' });
}

const trackFacebookAds = () => {
  window.fbq('track', 'Contact');
}