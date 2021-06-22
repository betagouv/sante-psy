// Code strongly inspired from https://developer.matomo.org/guides/spa-tracking
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Matomo = () => {
  const location = useLocation();
  const [previousURL, setPreviousURL] = useState();

  useEffect(() => {
    if (previousURL) {
      _paq.push(['setReferrerUrl', previousURL]);
    }

    _paq.push(['setCustomUrl', window.location.href]);

    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['trackPageView']);

    const content = document.getElementById('content');
    _paq.push(['MediaAnalytics::scanForMedia', content]);
    _paq.push(['FormAnalytics::scanForForms', content]);
    _paq.push(['trackContentImpressionsWithinNode', content]);
    _paq.push(['enableLinkTracking']);

    setPreviousURL(window.location.href);
  }, [location]);
  return <></>;
};

export default Matomo;
