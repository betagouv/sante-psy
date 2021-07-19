import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ loading }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  }, [loading, hash]);

  return (null);
}

export default ScrollToTop;
