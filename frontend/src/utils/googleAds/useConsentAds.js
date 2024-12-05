import React, { useEffect, useState } from 'react';
import trackAds from 'services/trackAds';

const NEWSLETTER_ADMIN_ID = 'AW-10803675495';
const NEWSLETTER_CONVERSION_ID = '0jD3CLHYqYMDEOeCzJ8o';

const ELIGIBILITY_ADMIN_ID = 'AW-16789199138';
const ELIGIBILITY_CONVERSION_ID = 'IjfPCM7ouu4ZEKKy28U-';

const useConsentAds = (withTracking, isEligibility = false) => {
  const [facebookConsent, setFacebookConsent] = useState(false);
  const [googleAdsConsent, setGoogleAdsConsent] = useState(false);

  useEffect(() => {
    if (withTracking) {
      trackAds.initAxeptio();

      if (!window._axcb) {
        window._axcb = [];
      }

      window._axcb.push(axeptio => {
        axeptio.on('cookies:complete', choices => {
          if (choices.facebook_pixel) {
            setFacebookConsent(true);
            trackAds.initFacebookAds();
          } else {
            setFacebookConsent(false);
            trackAds.removeFacebookAds();
          }

          if (choices.Google_Ads) {
            setGoogleAdsConsent(true);
            if (isEligibility) {
              trackAds.initGoogleAds(ELIGIBILITY_ADMIN_ID);
            } else {
              trackAds.initGoogleAds(NEWSLETTER_ADMIN_ID);
            }
          } else {
            setGoogleAdsConsent(false);
            trackAds.removeGoogleAds();
          }
        });

        axeptio.on('consent:saved', () => {
          window.location.reload();
        });
      });
    }
  }, [withTracking]);

  const trackGoogleAdsEligibility = React.useCallback(() => {
    if (googleAdsConsent) {
      trackAds.trackGoogleAds(`${ELIGIBILITY_ADMIN_ID}/${ELIGIBILITY_CONVERSION_ID}`, 1.0);
    }
  }, [googleAdsConsent]);

  const trackGoogleAdsNewsletter = React.useCallback(() => {
    if (googleAdsConsent) {
      trackAds.trackGoogleAds(`${NEWSLETTER_ADMIN_ID}/${NEWSLETTER_CONVERSION_ID}`);
    }
  }, [googleAdsConsent]);

  const trackFacebookAds = React.useCallback(() => {
    if (facebookConsent) {
      trackAds.trackFacebookAds();
    }
  }, [facebookConsent]);

  return { trackGoogleAdsEligibility, trackGoogleAdsNewsletter, trackFacebookAds };
};

export default useConsentAds;
