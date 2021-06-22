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
    _paq.push(['trackPageView', 'Santé psy étudiants']);

    setPreviousURL(window.location.href);
  }, [location]);
  return <></>;
};

export default Matomo;
